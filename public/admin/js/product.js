// ChangeStatus
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    // console.log(path)


    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";
            // console.log(statusChange);
            // console.log(statusCurrent);
            // console.log(id);
            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action=action;
            formChangeStatus.submit();
        })
    })
}
// End changeStatus

//Checkbox-Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    
    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked) {
            // console.log("Check tat ca");
            inputsId.forEach(input => {
                input.checked = true;
            })
        } else {
            // console.log("Bo check tat ca");
            inputsId.forEach(input => {
                input.checked = false;
            })
        } 
    })

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const coutChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            // console.log(coutChecked);
            // console.log(inputsId.length);
            if(coutChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })
}
//End checkbox-Multi

// Form Change Multi
const formCHangeMulti = document.querySelector("[form-change-multi]");
// console.log(formCHangeMulti);
if(formCHangeMulti){
    formCHangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        // console.log(e);
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        // console.log(inputsChecked);
        const typeChange = e.target.elements.type.value;
        if(typeChange == "delete-all"){
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này không ???");
            if(!isConfirm){
                return;
            }
        }
        if(inputsChecked.length > 0){
            let ids = [];
            const inputIds = formCHangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;
                if(typeChange=="change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`)
                }else{
                    ids.push(id);
                }
            })
            // console.log(ids.join(", "));
            inputIds.value=ids.join(", ");
            formCHangeMulti.submit();
        }else {
            alert("Vui lòng chọn ít nhất 1 bản ghi !!!");
        }
    });
}
// End Form Change Multi 

//Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]")
if(buttonsDelete.length > 0 ) {
    const formDelete = document.querySelector("#form-delete-item");
    const path = formDelete.getAttribute("data-path");
    buttonsDelete.forEach( button => {
        button.addEventListener("click", () => {
            // console.log(button)
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này không ???")
            if(isConfirm){
                const id = button.getAttribute("data-id");
                // console.log(id)
                const action = `${path}/${id}?_method=DELETE`;
                // console.log(action);
                formDelete.action = action;
                formDelete.submit()
            }
        });
    });
}
//End Delete Item

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    let time = showAlert.getAttribute("data-time"); 
    time = parseInt(time);

    // Hiển thị thông báo và ẩn sau thời gian xác định
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time);

    // Khi click vào nút close-alert sẽ đóng luôn
    const closeAlert = showAlert.querySelector("[close-alert]");
    if (closeAlert) {
        closeAlert.addEventListener("click", () => {
            showAlert.classList.add("alert-hidden");
        });
    }

    // Sau khi ẩn animation, loại bỏ phần tử khỏi layout
    showAlert.addEventListener('animationend', () => {
        showAlert.style.display = 'none'; // Loại bỏ khỏi DOM
    });
}
// End Show Alert