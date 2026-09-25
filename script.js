// ==========================================
// POGA KSA MEMBER SYSTEM
// SUPABASE DATABASE
// ==========================================

const SUPABASE_URL =
  "https://fbxiositmlcyvqlvkhsz.supabase.co";

const SUPABASE_KEY =
  "PASTE_YOUR_SB_PUBLISHABLE_KEY_HERE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ==========================================
// VARIABLES
// ==========================================

let members = [];
let editId = null;


// ==========================================
// LOAD MEMBERS FROM SUPABASE
// ==========================================

async function loadMembers() {

  try {

    const { data, error } = await supabaseClient
      .from("members")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      throw error;
    }

    members = data || [];

    displayMembers();

  } catch (error) {

    console.error("Load members error:", error);

    alert(
      "Unable to load members.\n\n" +
      error.message
    );

  }
}


// ==========================================
// SAVE / ADD MEMBER
// ==========================================

async function saveMember() {

  const member = {

    full_name:
      document.getElementById("fullName").value.trim(),

    member_code:
      document.getElementById("memberCode").value.trim(),

    phone:
      document.getElementById("phone").value.trim(),

    email:
      document.getElementById("email").value.trim(),

    birthday:
      document.getElementById("birthday").value || null,

    passport_number:
      document
        .getElementById("passportNumber")
        .value.trim(),

    address:
      document
        .getElementById("address")
        .value.trim(),

    emergency_contact_person:
      document
        .getElementById("emergencyContactPerson")
        .value.trim(),

    emergency_contact_number:
      document
        .getElementById("emergencyContactNumber")
        .value.trim()

  };


  // Required field

  if (!member.full_name) {

    alert("Please enter the member's full name.");

    return;
  }


  const saveButton =
    document.getElementById("saveButton");

  saveButton.disabled = true;
  saveButton.textContent = "Saving...";


  try {

    // ======================================
    // UPDATE EXISTING MEMBER
    // ======================================

    if (editId !== null) {

      const { error } =
        await supabaseClient
          .from("members")
          .update(member)
          .eq("id", editId);

      if (error) {
        throw error;
      }

      editId = null;

      saveButton.textContent =
        "Add Member";

    }

    // ======================================
    // ADD NEW MEMBER
    // ======================================

    else {

      const { error } =
        await supabaseClient
          .from("members")
          .insert(member);

      if (error) {
        throw error;
      }

    }


    clearForm();

    await loadMembers();


  } catch (error) {

    console.error("Save member error:", error);

    alert(
      "Unable to save member.\n\n" +
      error.message
    );

  } finally {

    saveButton.disabled = false;

    if (editId === null) {
      saveButton.textContent =
        "Add Member";
    }

  }

}


// ==========================================
// DISPLAY MEMBERS
// ==========================================

function displayMembers(memberList = members) {

  const table =
    document.getElementById("memberTable");

  if (!table) {
    return;
  }

  table.innerHTML = "";


  memberList.forEach(member => {

    const row = table.insertRow();


    row.innerHTML = `

      <td>${escapeHTML(member.member_code || "")}</td>

      <td>${escapeHTML(member.full_name || "")}</td>

      <td>${escapeHTML(member.phone || "")}</td>

      <td>${escapeHTML(member.email || "")}</td>

      <td>${escapeHTML(member.address || "")}</td>

      <td>

        <button
          class="edit"
          onclick="editMember(${member.id})">
