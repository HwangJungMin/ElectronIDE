class WorkspaceManager {
  private root: string | null = null;
  setRoot(path: string) {
    this.root = path;
  }
  getRoot() {
    return this.root;
  }
}

export const workspaceManager = new WorkspaceManager();
