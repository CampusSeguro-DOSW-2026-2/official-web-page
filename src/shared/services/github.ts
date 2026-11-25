/*
 * Live access to the public documentation repository. The list of files comes from the GitHub API
 * and the contents from raw.githubusercontent.com, so any change merged into documentation shows up
 * on the site without deploying it again.
 */

const OWNER = 'CampusSeguro-DOSW-2026-2';
const REPOSITORY = 'documentation';
const BRANCH = 'main';

export const ORGANIZATION_URL = `https://github.com/${OWNER}`;
export const DOCUMENTATION_REPOSITORY_URL = `${ORGANIZATION_URL}/${REPOSITORY}`;

const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPOSITORY}/${BRANCH}/`;
const BLOB_BASE = `${DOCUMENTATION_REPOSITORY_URL}/blob/${BRANCH}/`;
const TREE_BASE = `${DOCUMENTATION_REPOSITORY_URL}/tree/${BRANCH}/`;
const TREE_API_URL = `https://api.github.com/repos/${OWNER}/${REPOSITORY}/git/trees/${BRANCH}?recursive=1`;
const SNAPSHOT_URL = `${import.meta.env.BASE_URL}documentation-tree.json`;

const CACHE_KEY = 'campus-seguro.documentation-tree';
const CACHE_TTL_MS = 5 * 60 * 1000;

interface TreeEntry {
  path: string;
  type: string;
}

interface TreeResponse {
  tree: TreeEntry[];
}

interface CachedTree {
  savedAt: number;
  paths: string[];
}

let treeRequest: Promise<string[]> | null = null;
const textRequests = new Map<string, Promise<string>>();
const svgUrlRequests = new Map<string, Promise<string>>();

/**
 * Encodes every segment of a repository path for use in a URL
 * @param path file path inside the documentation repository
 * @returns the encoded path
 */
function encodePath(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

/**
 * Builds the URL that serves the raw content of a file
 * @param path file path inside the documentation repository
 * @returns the raw URL of the file
 */
export function rawUrl(path: string): string {
  return RAW_BASE + encodePath(path);
}

/**
 * Builds the URL that shows a file on GitHub
 * @param path file path inside the documentation repository
 * @returns the GitHub URL of the file
 */
export function blobUrl(path: string): string {
  return BLOB_BASE + encodePath(path);
}

/**
 * Builds the URL that shows a folder on GitHub
 * @param path folder path inside the documentation repository
 * @returns the GitHub URL of the folder
 */
export function folderUrl(path: string): string {
  return TREE_BASE + encodePath(path);
}

/**
 * Reads the list of files saved by a previous visit
 * @returns the cached list, or null when there is none
 */
function readCache(): CachedTree | null {
  try {
    const stored = window.localStorage.getItem(CACHE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as CachedTree;
  } catch {
    return null;
  }
}

/**
 * Saves the list of files for later visits
 * @param paths files of the documentation repository
 */
function writeCache(paths: string[]): void {
  try {
    const cached: CachedTree = { savedAt: Date.now(), paths };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // Storage may be full or blocked; the site keeps working without the cache
  }
}

/**
 * Keeps only the files of a tree returned by GitHub
 * @param response tree of the repository
 * @returns the paths of its files
 */
function filePaths(response: TreeResponse): string[] {
  return response.tree
    .filter((entry) => entry.type === 'blob')
    .map((entry) => entry.path);
}

/**
 * Downloads a tree of the repository and returns its files
 * @param url address of the tree
 * @returns the paths of the files
 * @throws Error when the tree cannot be downloaded
 */
async function downloadTree(url: string): Promise<string[]> {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) {
    throw new Error(`Tree request failed with status ${response.status}`);
  }
  const body = (await response.json()) as TreeResponse;
  return filePaths(body);
}

/**
 * Gets the list of files, live from GitHub; falls back to the last saved list and then to the
 * snapshot published with the site when GitHub cannot answer
 * @returns the paths of every file in the documentation repository
 * @throws Error when no source of the list is available
 */
async function loadTree(): Promise<string[]> {
  const cached = readCache();
  if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
    return cached.paths;
  }
  try {
    const paths = await downloadTree(TREE_API_URL);
    writeCache(paths);
    return paths;
  } catch (liveError) {
    if (cached) {
      return cached.paths;
    }
    try {
      return await downloadTree(SNAPSHOT_URL);
    } catch {
      throw liveError;
    }
  }
}

/**
 * Gets the list of files of the documentation repository, shared by every page of the visit
 * @returns the paths of every file in the repository
 * @throws Error when the list cannot be obtained
 */
export function fetchDocumentationTree(): Promise<string[]> {
  if (!treeRequest) {
    treeRequest = loadTree().catch((error: unknown) => {
      treeRequest = null;
      throw error;
    });
  }
  return treeRequest;
}

/**
 * Gets the text of a file of the documentation repository
 * @param path file path inside the repository
 * @returns the content of the file
 * @throws Error when the file cannot be downloaded
 */
export function fetchFileText(path: string): Promise<string> {
  const existing = textRequests.get(path);
  if (existing) {
    return existing;
  }
  const request = fetch(rawUrl(path))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`File request failed with status ${response.status}`);
      }
      return response.text();
    })
    .catch((error: unknown) => {
      textRequests.delete(path);
      throw error;
    });
  textRequests.set(path, request);
  return request;
}

/**
 * Gets a local URL that displays an SVG file of the repository as an image, because GitHub does
 * not serve raw files with the image content type
 * @param path SVG file path inside the repository
 * @returns an object URL with the image
 * @throws Error when the file cannot be downloaded
 */
export function fetchSvgUrl(path: string): Promise<string> {
  const existing = svgUrlRequests.get(path);
  if (existing) {
    return existing;
  }
  const request = fetchFileText(path)
    .then((text) => URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' })))
    .catch((error: unknown) => {
      svgUrlRequests.delete(path);
      throw error;
    });
  svgUrlRequests.set(path, request);
  return request;
}
