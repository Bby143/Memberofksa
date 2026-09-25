let members = [];
let editIndex = -1;
let selectedPhoto = "";

const memberForm = document.getElementById("memberForm");
const memberId = document.getElementById("memberId");
const fullName = document.getElementById("fullName");
const passportNumber = document.getElementById("passportNumber");
const address = document.getElementById("address");
const birthday = document.getElementById("birthday");
const contact = document.getElementById("contact");
const emergencyContact = document.getElementById("emergencyContact");
const emergencyNumber = document.getElementById("emergencyNumber");
const status = document.getElementById("status");
const photo = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");
const memberTable = document.getElementById("memberTable");
const search = document.getElementById("search");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const formTitle = document.getElementById("formTitle");
const emptyMessage = document.getElementById("emptyMessage");

loadMembers();

memberForm.addEventListener("submit", e => {
  e.preventDefault();
  saveMember();
});

search.addEventListener("input", displayMembers);

photo.addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    selectedPhoto = e.target.result;
    photoPreview.innerHTML =
      `<img src="${selectedPhoto}" class="preview-image" alt="Member photo">`;
  };
  reader.readAsDataURL(file);
});

cancelButton.addEventListener("click", resetForm);

function saveMember() {
  const member = {
    memberId: memberId.value.trim(),
    fullName: fullName.value.trim(),
    passportNumber: passportNumber.value.trim(),
    address: address.value.trim(),
    birthday: birthday.value,
    contact: contact.value.trim(),
    emergencyContact: emergencyContact.value.trim(),
    emergencyNumber: emergencyNumber.value.trim(),
    status: status.value,
    photo: selectedPhoto
  };

  if (!member.memberId || !member.fullName) {
    alert("Please enter Member ID and Full Name.");
    return;
  }

  if (editIndex === -1) {
    const duplicate = members.some(m =>
      m.memberId.toLowerCase() === member.memberId.toLowerCase()
    );
    if (duplicate) {
      alert("This Member ID already exists.");
      return;
    }
    members.push(member);
    alert("Member added successfully.");
  } else {
    if (!selectedPhoto) member.photo = members[editIndex].photo;
    members[editIndex] = member;
    alert("Member updated successfully.");
  }

  saveToLocalStorage();
  resetForm();
  displayMembers();
}

function displayMembers() {
  memberTable.innerHTML = "";
  const q = search.value.trim().toLowerCase();

  const filtered = members.filter(m =>
    m.memberId.toLowerCase().includes(q) ||
    m.fullName.toLowerCase().includes(q) ||
    m.passportNumber.toLowerCase().includes(q) ||
    m.address.toLowerCase().includes(q) ||
    m.contact.toLowerCase().includes(q) ||
    m.emergencyContact.toLowerCase().includes(q) ||
    m.status.toLowerCase().includes(q)
  );

  emptyMessage.style.display = filtered.length ? "none" : "block";

  filtered.forEach(member => {
    const index = members.indexOf(member);
    const row = document.createElement("tr");
    const statusClass =
      member.status === "Active" ? "status-active" : "status-inactive";

    const photoHTML = member.photo
      ? `<img src="${member.photo}" class="member-photo" alt="Member photo">`
      : `<div class="no-photo">No Photo</div>`;

    row.innerHTML = `
      <td>${photoHTML}</td>
      <td>${escapeHTML(member.memberId)}</td>
      <td>${escapeHTML(member.fullName)}</td>
      <td>${escapeHTML(member.passportNumber)}</td>
      <td>${escapeHTML(member.birthday)}</td>
      <td>${escapeHTML(member.contact)}</td>
      <td class="${statusClass}">${escapeHTML(member.status)}</td>
      <td>
        <button class="btn-edit" onclick="editMember(${index})">Edit</button>
        <button class="btn-delete" onclick="deleteMember(${index})">Delete</button>
      </td>
    `;

    memberTable.appendChild(row);
  });
}

function editMember(index) {
  const member = members[index];

  memberId.value = member.memberId;
  fullName.value = member.fullName;
  passportNumber.value = member.passportNumber;
  address.value = member.address;
  birthday.value = member.birthday;
  contact.value = member.contact;
  emergencyContact.value = member.emergencyContact;
  emergencyNumber.value = member.emergencyNumber;
  status.value = member.status;
  selectedPhoto = member.photo || "";

  photoPreview.innerHTML = selectedPhoto
    ? `<img src="${selectedPhoto}" class="preview-image" alt="Member photo">`
    : "";

  editIndex = index;
  formTitle.textContent = "Edit Member";
  saveButton.textContent = "Update Member";
  cancelButton.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteMember(index) {
  const member = members[index];

  if (!confirm(`Delete ${member.fullName}?`)) return;

  members.splice(index, 1);
  saveToLocalStorage();
  displayMembers();
  alert("Member deleted successfully.");
}

function resetForm() {
  memberForm.reset();
  status.value = "Active";
  editIndex = -1;
  selectedPhoto = "";
  photoPreview.innerHTML = "";
  formTitle.textContent = "Add Member";
  saveButton.textContent = "Add Member";
  cancelButton.classList.add("hidden");
}

function saveToLocalStorage() {
  localStorage.setItem("pogaKsaMembers", JSON.stringify(members));
}

function loadMembers() {
  const saved = localStorage.getItem("pogaKsaMembers");

  if (saved) {
    try {
      members = JSON.parse(saved);
    } catch {
      members = [];
    }
  }

  displayMembers();
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ==========================================
// POGA KSA MEMBER REGISTRATION
// SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL =
  "https://fbxiositmlcyvqlvkhsz.supabase.co";

const SUPABASE_KEY =
  "ILAGAY_DITO_ANG_SB_PUBLISHABLE_KEY_MO";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// ==========================================
// REGISTRATION FORM
// ==========================================

const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");


// Check if form exists
if (form) {

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    message.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {

      // --------------------------------------
      // GET FORM VALUES
      // --------------------------------------

      const fullName =
        document.getElementById("full_name").value.trim();

      const memberCode =
        document.getElementById("member_code").value.trim();

      const phone =
        document.getElementById("phone").value.trim();

      const email =
        document.getElementById("email").value.trim();

      const birthday =
        document.getElementById("birthday").value || null;

      const passportNumber =
        document
          .getElementById("passport_number")
          .value
          .trim();

      const address =
        document
          .getElementById("address")
          .value
          .trim();

      const emergencyPerson =
        document
          .getElementById("emergency_contact_person")
          .value
          .trim();

      const emergencyNumber =
        document
          .getElementById("emergency_contact_number")
          .value
          .trim();

      const photoInput =
        document.getElementById("photo");

      const photoFile =
        photoInput.files[0];


      // --------------------------------------
      // REQUIRED FIELD
      // --------------------------------------

      if (!fullName) {

        throw new Error(
          "Please enter your full name."
        );

      }


      // --------------------------------------
      // PHOTO UPLOAD
      // --------------------------------------

      let photoUrl = null;

      if (photoFile) {

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp"
        ];

        if (!allowedTypes.includes(photoFile.type)) {

          throw new Error(
            "Please upload a JPG, PNG, or WEBP photo."
          );

        }


        // Maximum 5 MB

        if (photoFile.size > 5 * 1024 * 1024) {

          throw new Error(
            "Photo must be smaller than 5 MB."
          );

        }


        const extension =
          photoFile.name
            .split(".")
            .pop()
            .toLowerCase();


        const fileName =
          crypto.randomUUID() +
          "." +
          extension;


        const { error: uploadError } =
          await supabaseClient
            .storage
            .from("member-photos")
            .upload(
              fileName,
              photoFile
            );


        if (uploadError) {

          throw uploadError;

        }


        photoUrl = fileName;

      }


      // --------------------------------------
      // SAVE MEMBER INFORMATION
      // --------------------------------------

      const { error: insertError } =
        await supabaseClient
          .from("members")
          .insert({

            full_name: fullName,

            member_code:
              memberCode || null,

            phone:
              phone || null,

            email:
              email || null,

            birthday:
              birthday,

            passport_number:
              passportNumber || null,

            address:
              address || null,

            emergency_contact_person:
              emergencyPerson || null,

            emergency_contact_number:
              emergencyNumber || null,

            photo_url:
              photoUrl

          });


      if (insertError) {

        throw insertError;

      }


      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      message.textContent =
        "Registration successful! Thank you.";

      message.style.color =
        "green";


      // Clear form

      form.reset();


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      message.textContent =
        "Registration failed: " +
        error.message;

      message.style.color =
        "red";


    } finally {

      submitBtn.disabled = false;

      submitBtn.textContent =
        "Submit Registration";

    }

  });

}
