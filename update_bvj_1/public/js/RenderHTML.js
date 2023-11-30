class RecentSubmissionPaper {
  constructor(data){
    this.data = data;
  }

  render(){
    const paper = document.createElement('div');
    paper.classList.add("bg-light", "border", "border-gray-300", "px-3", "py-2", "flex", "flex-col", "justify-start", "items-start", "w-full", "rounded-sm");

    const title = document.createElement('h1');
    title.classList.add("text-xl");
    title.innerText = this.data.title;

    const authors = document.createElement('h3');
    authors.classList.add("text-xl", "font-extralight");
    authors.innerText = this.data.paper_authors;

    const paperId = document.createElement('div');
    paperId.classList.add("bg-dark", "text-white", "text-sm", "font-semibold", "my-2", "px-2", "py-1", "rounded");
    paperId.innerText = `Paper ID: ${this.data.paper_id}`;

    const btnGroup = document.createElement('div');
    btnGroup.classList.add("btn-group", "w-full");
    btnGroup.setAttribute("role", "group");
    btnGroup.setAttribute("aria-label", "Basic example");

    const downloadBtn = document.createElement('a');
    downloadBtn.setAttribute("href", `/uploads/papers/${this.data.file_url}`);
    downloadBtn.setAttribute("download", "");
    downloadBtn.setAttribute("role", "button");
    downloadBtn.setAttribute("type", "button");
    downloadBtn.classList.add("btn", "bg-sky-600", "hover:bg-sky-700", "transition-all", "duration-150", "ease-in", "text-white/90", "hover:text-white");
    downloadBtn.innerHTML = `<i class="fa-solid fa-download"></i> <span class="hidden lg:inline-block ml-1"> Download File</span>`;
    btnGroup.appendChild(downloadBtn);

    const viewBtn = document.createElement('a');
    viewBtn.setAttribute("href", `/uploads/papers/${this.data.file_url}`);
    viewBtn.setAttribute("target", "_blank");
    viewBtn.setAttribute("role", "button");
    viewBtn.setAttribute("type", "button");
    viewBtn.classList.add("btn", "bg-yellow-500", "hover:bg-yellow-600", "transition-all", "duration-150", "ease-in", "text-yellow-900");
    viewBtn.innerHTML = `<i class="fa-solid fa-eye"></i> <span class="hidden lg:inline-block ml-1"> View File</span>`;
    btnGroup.appendChild(viewBtn);

    const assignReviewerBtn = document.createElement('button');
    assignReviewerBtn.setAttribute("type", "button");
    assignReviewerBtn.classList.add("btn", "bg-success", "text-white/90", "hover:text-white");
    assignReviewerBtn.setAttribute("data-assign-reviewer-btn", "");
    assignReviewerBtn.setAttribute("aria-colindex", "1");
    assignReviewerBtn.setAttribute("aria-label", `${this.data.paper_id}`);
    assignReviewerBtn.innerHTML = `<i class="fa-solid fa-user-plus pointer-events-none"></i><span class="hidden pointer-events-none lg:inline-block ml-1"> Assign Reviewer</span>`;
    btnGroup.appendChild(assignReviewerBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute("type", "button");
    deleteBtn.classList.add("btn", "bg-danger", "text-white/90", "hover:text-white");
    deleteBtn.setAttribute("data-delete-btn", "");
    deleteBtn.setAttribute("aria-label", `${this.data.paper_id}`);

    deleteBtn.innerHTML = `<i class="fa-sharp fa-solid fa-trash pointer-events-none"></i> <span class="hidden pointer-events-none lg:inline-block ml-1"> Delete</span>`;
    btnGroup.appendChild(deleteBtn);

    paper.appendChild(title);
    paper.appendChild(authors);
    paper.appendChild(paperId);
    paper.appendChild(btnGroup);

    return paper;
  }
}

class RenderAssignReviewer {
  constructor(data){
    this.data = data;
  }

  render(){
    const modal = document.createElement('div');
    modal.classList.add("opacity-0", "pointer-events-none", "h-screen", "w-full", "fixed", "top-0", "right-0", "flex", "justify-center", "items-start", "bg-black/40", "z-40", "transition-all", "duration-75", "ease-in");
    modal.setAttribute("id", "floating1");

    const modalContent = document.createElement('div');
    modalContent.classList.add("bg-white", "w-1/2", "py-3", "rounded", "relative", "mt-10");

    const modalHeader = document.createElement('div');

    const modalTitle = document.createElement('span');
    modalTitle.classList.add("text-2xl", "font-medium");
    modalTitle.innerText = "Reviewer List";

    const modalCloseBtn = document.createElement('button');
    modalCloseBtn.classList.add("btn", "btn-light");
    modalCloseBtn.setAttribute("data-close-btn", "");
    modalCloseBtn.setAttribute("aria-colindex", "1");

    const modalCloseBtnIcon = document.createElement('i');
    modalCloseBtnIcon.classList.add("fa-sharp", "fa-solid", "fa-xmark");
    modalCloseBtn.appendChild(modalCloseBtnIcon);


    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalCloseBtn);

    const modalBody = document.createElement('div');
    modalBody.classList.add("px-3", "max-h-96", "overflow-auto");

    const table = document.createElement('table');
    table.classList.add("table");

    const thead = document.createElement('thead');

    const tr = document.createElement('tr');

    const th1 = document.createElement('th');
    th1.setAttribute("scope", "col");
    th1.innerText = "Reviewer Name";

    const th2 = document.createElement('th');
    th2.setAttribute("scope", "col");
    th2.innerText = "Email";

    const th3 = document.createElement('th');

    const th3Span = document.createElement('span');
    th3Span.classList.add("sr-only");
    th3Span.innerText = "Action";

    th3.appendChild(th3Span);


    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);


    thead.appendChild(tr);

    const tbody = document.createElement('tbody');

    this.data.forEach(reviewer => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.innerText = reviewer.name;
      const td2 = document.createElement('td');
      td2.innerText = reviewer.email;
      const td3 = document.createElement('td');
      const td3Btn = document.createElement('button');
      td3Btn.classList.add("btn", "btn-light");
      td3Btn.setAttribute("data-delete-reviewer-btn", "");
      td3Btn.setAttribute("aria-label", `${reviewer.id}`);
      const td3BtnIcon = document.createElement('i');
      td3BtnIcon.classList.add("fa-sharp", "fa-solid", "fa-trash");
      td3Btn.appendChild(td3BtnIcon);
      td3.appendChild(td3Btn);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    modalBody.appendChild(table);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);

    return modal;
  }
}

{/* <div id="floating1" class="opacity-0 pointer-events-none h-screen w-full fixed top-0 right-0 flex justify-center items-start bg-black/40 z-40 transition-all duration-75 ease-in">
      <div class="bg-white w-1/2 py-3 rounded relative mt-10 ">
        <div class="flex justify-between items-center px-3 pb-3 border-b border-gray-300">
          <span class="text-2xl font-medium">Reviewer List</span>
          <button class="btn btn-light" data-close-btn aria-colindex="1"><i class="fa-sharp fa-solid fa-xmark"></i></button>
        </div>

        <div class="px-3 max-h-96 overflow-auto">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Reviewer Name</th>
                <th scope="col">Email</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody id="reviewer">
              ${reviewerList}
            </tbody>
          </table>
        </div>

        <div class="px-3 flex justify-end items-center border-t border-gray-300 mt-4 pt-3">
          <button class="btn btn-danger" data-close-btn aria-colindex="1">Close</button>
        </div>
      </div>
    </div> */}

const Render = {
  RecentSubmissionPaper,
  RenderAssignReviewer
}