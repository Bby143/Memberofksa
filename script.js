// ============================================
// POGA KSA MEMBER MANAGEMENT SYSTEM
// ============================================


// ============================================
// VARIABLES
// ============================================

let members = [];

let editIndex = -1;

let selectedPhoto = "";


// ============================================
// GET HTML ELEMENTS
// ============================================

const memberForm =
    document.getElementById("memberForm");


const memberId =
    document.getElementById("memberId");


const fullName =
    document.getElementById("fullName");


const passportNumber =
    document.getElementById("passportNumber");


const address =
    document.getElementById("address");


const birthday =
    document.getElementById("birthday");


const contact =
    document.getElementById("contact");


const emergencyContact =
    document.getElementById("emergencyContact");


const emergencyNumber =
    document.getElementById("emergencyNumber");


const status =
    document.getElementById("status");


const photo =
    document.getElementById("photo");


const photoPreview =
    document.getElementById("photoPreview");


const memberTable =
    document.getElementById("memberTable");


const search =
    document.getElementById("search");


const saveButton =
    document.getElementById("saveButton");


const cancelButton =
    document.getElementById("cancelButton");


const formTitle =
    document.getElementById("formTitle");


const emptyMessage =
    document.getElementById("emptyMessage");


// ============================================
// LOAD SAVED MEMBERS
// ============================================

loadMembers();


// ============================================
// FORM SUBMIT
// ============================================

memberForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        saveMember();

    }
);


// ============================================
// SEARCH
// ============================================

search.addEventListener(
    "input",
    function() {

        displayMembers();

    }
);


// ============================================
// PHOTO SELECTION
// ============================================

photo.addEventListener(
    "change",
    function(event) {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function(e) {

                selectedPhoto =
                    e.target.result;


                photoPreview.innerHTML = `

                    <img
                        src="${selectedPhoto}"
                        class="preview-image"
                        alt="Member photo"
                    >

                `;

            };


        reader.readAsDataURL(file);

    }
);


// ============================================
// CANCEL EDIT
// ============================================

cancelButton.addEventListener(
    "click",
    function() {

        resetForm();

    }
);


// ============================================
// SAVE MEMBER
// ============================================

function saveMember() {

    const member = {

        memberId:
            memberId.value.trim(),

        fullName:
            fullName.value.trim(),

        passportNumber:
            passportNumber.value.trim(),

        address:
            address.value.trim(),

        birthday:
            birthday.value,

        contact:
            contact.value.trim(),

        emergencyContact:
            emergencyContact.value.trim(),

        emergencyNumber:
            emergencyNumber.value.trim(),

        status:
            status.value,

        photo:
            selectedPhoto

    };


    // REQUIRED FIELDS

    if (
        member.memberId === "" ||
        member.fullName === ""
    ) {

        alert(
            "Please enter Member ID and Full Name."
        );

        return;

    }


    // DUPLICATE MEMBER ID

    if (editIndex === -1) {

        const duplicate =
            members.some(
                existingMember =>

                    existingMember.memberId
                        .toLowerCase() ===
                    member.memberId
                        .toLowerCase()
            );


        if (duplicate) {

            alert(
                "This Member ID already exists."
            );

            return;

        }

    }


    // UPDATE

    if (editIndex !== -1) {

        // Keep old photo if no new photo selected

        if (selectedPhoto === "") {

            member.photo =
                members[editIndex].photo;

        }


        members[editIndex] =
            member;


        alert(
            "Member updated successfully."
        );

    }


    // ADD

    else {

        members.push(member);


        alert(
            "Member added successfully."
        );

    }


    // SAVE

    saveToLocalStorage();


    // RESET

    resetForm();


    // DISPLAY

    displayMembers();

}


// ============================================
// DISPLAY MEMBERS
// ============================================

function displayMembers() {

    memberTable.innerHTML = "";


    const searchText =
        search.value
            .trim()
            .toLowerCase();


    const filteredMembers =
        members.filter(
            member =>

                member.memberId
                    .toLowerCase()
                    .includes(searchText) ||

                member.fullName
                    .toLowerCase()
                    .includes(searchText) ||

                member.passportNumber
                    .toLowerCase()
                    .includes(searchText) ||

                member.address
                    .toLowerCase()
                    .includes(searchText) ||

                member.contact
                    .toLowerCase()
                    .includes(searchText) ||

                member.emergencyContact
                    .toLowerCase()
                    .includes(searchText) ||

                member.status
                    .toLowerCase()
                    .includes(searchText)
        );


    // NO RECORDS

    if (filteredMembers.length === 0) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    // CREATE TABLE ROWS

    filteredMembers.forEach(
        member => {

            const originalIndex =
                members.indexOf(member);


            const row =
                document.createElement("tr");


            const statusClass =
                member.status === "Active"
                    ? "status-active"
                    : "status-inactive";


            let photoHTML;


            if (member.photo) {

                photoHTML = `

                    <img
                        src="${member.photo}"
                        class="member-photo"
                        alt="Member photo"
                    >

                `;

            }

            else {

                photoHTML = `

                    <div class="no-photo">
                        No Photo
                    </div>

                `;

            }


            row.innerHTML = `

                <td>
                    ${photoHTML}
                </td>


                <td>
                    ${escapeHTML(
                        member.memberId
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        member.fullName
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        member.passportNumber
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        member.birthday
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        member.contact
                    )}
                </td>


                <td class="${statusClass}">
                    ${escapeHTML(
                        member.status
                    )}
                </td>


                <td>

                    <button
                        class="btn-edit"
                        onclick="
                            editMember(
                                ${originalIndex}
                            )
                        "
                    >
                        Edit
                    </button>


                    <button
                        class="btn-delete"
                        onclick="
                            deleteMember(
                                ${originalIndex}
                            )
                        "
                    >
                        Delete
                    </button>

                </td>

            `;


            memberTable.appendChild(row);

        }
    );

}


// ============================================
// EDIT MEMBER
// ============================================

function editMember(index) {

    const member =
        members[index];


    memberId.value =
        member.memberId;


    fullName.value =
        member.fullName;


    passportNumber.value =
        member.passportNumber;


    address.value =
        member.address;


    birthday.value =
        member.birthday;


    contact.value =
        member.contact;


    emergencyContact.value =
        member.emergencyContact;


    emergencyNumber.value =
        member.emergencyNumber;


    status.value =
        member.status;


    selectedPhoto =
        member.photo || "";


    if (selectedPhoto) {

        photoPreview.innerHTML = `

            <img
                src="${selectedPhoto}"
                class="preview-image"
                alt="Member photo"
            >

        `;

    }

    else {

        photoPreview.innerHTML = "";

    }


    editIndex = index;


    formTitle.textContent =
        "Edit Member";


    saveButton.textContent =
        "Update Member";


    cancelButton.classList.remove(
        "hidden"
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ============================================
// DELETE MEMBER
// ============================================

function deleteMember(index) {

    const member =
        members[index];


    const confirmed =
        confirm(
            `Delete ${member.fullName}?`
        );


    if (!confirmed) {

        return;

    }


    members.splice(index, 1);


    saveToLocalStorage();


    displayMembers();


    alert(
        "Member deleted successfully."
    );

}


// ============================================
// RESET FORM
// ============================================

function resetForm() {

    memberForm.reset();


    status.value =
        "Active";


    editIndex = -1;


    selectedPhoto = "";


    photoPreview.innerHTML =
        "";


    formTitle.textContent =
        "Add Member";


    saveButton.textContent =
        "Add Member";


    cancelButton.classList.add(
        "hidden"
    );

}


// ============================================
// SAVE TO LOCAL STORAGE
// ============================================

function saveToLocalStorage() {

    localStorage.setItem(

        "pogaKsaMembers",

        JSON.stringify(members)

    );

}


// ============================================
// LOAD FROM LOCAL STORAGE
// ============================================

function loadMembers() {

    const savedMembers =
        localStorage.getItem(
            "pogaKsaMembers"
        );


    if (savedMembers) {

        try {

            members =
                JSON.parse(
                    savedMembers
                );

        }

        catch (error) {

            members = [];

            console.error(
                "Could not load member data.",
                error
            );

        }

    }


    displayMembers();

}


// ============================================
// BASIC HTML SECURITY
// ============================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}
