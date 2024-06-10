import request from "configs/request";

export function getTemplateImportExcel() {
  return request("/student/excel/template", {
    method: "GET",
  });
}

export function importExcel(data) {
  return request("/student/import", { method: "POST", data });
}

export function createTemplateImportExcel() {
  return request("/student/excel/create-template", { method: "GET" });
}
