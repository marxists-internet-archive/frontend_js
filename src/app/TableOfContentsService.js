export class TableOfContentsService {
  constructor() {
    this.chapters = document.querySelectorAll("h2");
  }

  generateContents() {
    // TODO
  }

  run() {
    console.log("Run Table of contents service");
    this.generateContents();
  }
}
