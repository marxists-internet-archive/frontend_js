import {
  TableOfContentsService
} from "./app/TableOfContentsService";

window.onload = function () {
  new TableOfContentsService().run();
  console.log("script is running");
};