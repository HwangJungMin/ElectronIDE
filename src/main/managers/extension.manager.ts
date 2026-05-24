class ExtensionManager {
  private loaded = new Set<string>();
  load(id: string) {
    this.loaded.add(id);
  }
  list() {
    return [...this.loaded];
  }
}

export const extensionManager = new ExtensionManager();
