export class TableOfContentsService {
  constructor() {
    this.chapters = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    this.header = document.getElementById("header");
  }

  generateChaptersTable(index, depth, node) {
    if (index < this.chapters.length) {
      const chapter = this.chapters[index];
      const chapterHierarchy = this.getTagHierarchy(chapter.tagName);
      const heading = document.createElement("a");
      heading.className += "accordeon-chapter "
      heading.textContent = chapter.textContent;
      heading.href = "#chapter-link-" + index;
      chapter.id = "chapter-link-" + index;

      if (depth == chapterHierarchy) {
        node.appendChild(heading);
        this.generateChaptersTable(index + 1, depth, node);
      } else if (depth < chapterHierarchy) {
        const content = document.createElement("div");
        content.className += "accordeon-content ";
        content.appendChild(heading);
        node.appendChild(content);
        this.generateChaptersTable(index + 1, depth + 1, content);
      } else if (depth > chapterHierarchy) {
        node.previousElementSibling.className += "accordeon ";
        this.generateChaptersTable(index, depth - 1, node.parentNode);
      }
    } else if (depth > 1) {
      node.previousElementSibling.className += "accordeon "
      this.generateChaptersTable(index, depth - 1, node.parentNode);
    }
  }

  addEventListeners() {
    var accordions = document.getElementsByClassName("accordeon");
    for (var i = 0; i < accordions.length; i++) {
      accordions[i].onclick = function () {
        this.classList.toggle('is-open');

        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
          // accordion is currently open, so close it
          content.style.maxHeight = null;
        } else {
          // accordion is currently closed, so open it
          content.style.maxHeight = "100%";
        }
      }
    }
  }



  /**
   * 
   * @param {String} tag 
   */
  getTagHierarchy(tag) {
    return tag.replace(/^\D+/g, '');
  }



  run() {
    this.generateChaptersTable(0, 1, this.header);
    this.addEventListeners();
  }
}