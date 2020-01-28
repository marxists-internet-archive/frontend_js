import Bowser from 'bowser';

export class TableOfContentsService {
  constructor() {
    this.chapters = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    this.header = document.getElementById("header");

    this.modalContainer = document.createElement("div");
    this.modalContainer.className += "modal-container "

    this.modal = document.createElement("div");
    this.modal.className += "modal-content ";
    this.modal.id = "modal";

    this.modalCloseBtn = document.createElement("div");
    this.modalCloseBtn.id = "close-modal-btn"

    this.modalOpenBtn = document.createElement("div");
    this.modalOpenBtn.className += "open-modal-btn "
    this.modalOpenBtn.id = "open-modal-btn";
    this.header.appendChild(this.modalOpenBtn);

    this.modalContainer.appendChild(this.modalCloseBtn);
    this.modalContainer.appendChild(this.modal);
    this.header.appendChild(this.modalContainer);

    this.bowser = Bowser.parse(window.navigator.userAgent);

    this.scrollPosition = 0;
    this.openBtnOpacity = 0.9;
  }

  /**
   * @param {Integer} index -  Start with 0. Index of traversed list
   * @param {integer} depth - Recursion depth, for subchapters.
   * @param {Node} node - where to append the generated List
   */
  generateChaptersTable(index, depth, node) {
    if (index < this.chapters.length) {
      const chapter = this.chapters[index];
      const chapterHierarchy = this.getTagHierarchy(chapter.tagName);
      const heading = document.createElement("div");
      heading.className += "accordeon-chapter "
      const heading_link = document.createElement("a");
      heading_link.textContent = chapter.textContent;
      heading_link.href = "#chapter-link-" + index;
      heading.appendChild(heading_link);
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

  /**
   * Add Event Listeners to Chapters
   */
  addEventListeners() {
    var accordions = document.getElementsByClassName("accordeon");
    for (var i = 0; i < accordions.length; i++) {

      const expander = document.createElement("span");
      accordions[i].prepend(expander);
      expander.onclick = function () {
        this.classList.toggle('is-open');
        var content = this.parentNode.nextElementSibling;
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
   * Add event listeners to close button
   * @param {Node} modal 
   */
  closeChapterList(modal) {
    this.modalCloseBtn.onclick = () => {
      modal.style.opacity = "0";
      setTimeout(() => {
        modal.style.display = "none";
      }, 400);
    }
  }
  /**
   * Add event Listeners to open button
   * @param {Node} modal 
   */
  openChapterList(modal) {
    this.modalOpenBtn.onclick = () => {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.style.opacity = "1";
      }, 1);
    }
  }

  /**
   * Fade chapter btn in on scroll.
   * @param {Node} node 
   */
  chapterBtnOnScroll(node) {
    window.onscroll = () => {
      var scroll = this.getBodyScrollTop();
      if (scroll < 120) {
        node.style.opacity = 0.9;
      } else if (scroll > this.scrollPosition) {
        if (this.openBtnOpacity > 0) {
          this.openBtnOpacity = this.openBtnOpacity - 0.05;
        }
        node.style.opacity = this.openBtnOpacity;
      } else {
        if (this.openBtnOpacity < 0.9) {
          this.openBtnOpacity = this.openBtnOpacity + 0.05;
        }
        node.style.opacity = this.openBtnOpacity;
      }
      this.scrollPosition = scroll;
    }
  }


  getBodyScrollTop() {
    const el = document.scrollingElement || document.documentElement;
    return el.scrollTop
  }

  /**
   * Js workaround, strange bug in css...
   * Fade chapter btn in on hover.
   * @param {Node} node 
   */
  chapterBtnOnMouseOver(node) {
    node.onmouseover = () => {
      node.style.opacity = "0.9";
    }
    node.onmouseout = () => {
      // set button opacity to before...
      node.style.opacity = this.openBtnOpacity;
    }
  }

  /**
   * Extract number from H tags.
   * Needed for Chapter ranking.
   * @param {String} tag 
   */
  getTagHierarchy(tag) {
    return tag.replace(/^\D+/g, '');
  }

  /**
   * Chapters are generated, expand the first chapter, 
   * so user can see that they are expandable.
   */
  expandFirstParent() {
    const firstParent = document.querySelector("#modal > .accordeon-content");
    firstParent.style.maxHeight = "100%";
    firstParent.previousElementSibling.firstChild.classList.toggle('is-open');
  }

  safariWorkaround() {
    const name = this.bowser.browser.name;
    const type = this.bowser.platform.type;
    if (name == "Safari" && type == "desktop") {
      this.modalOpenBtn.style.transitionProperty = "none";
    }
  }

  run() {
    this.generateChaptersTable(0, 1, this.modal);
    this.addEventListeners();
    this.expandFirstParent();
    this.chapterBtnOnScroll(this.modalOpenBtn);
    this.chapterBtnOnMouseOver(this.modalOpenBtn);
    this.openChapterList(this.modalContainer);
    this.closeChapterList(this.modalContainer);
    this.safariWorkaround();

  }
}