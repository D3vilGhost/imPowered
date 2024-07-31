// function to close modal
function closeModal(modalId) {
    document.getElementById(modalId).close();
}

// error modal
function showErrorModal(message) {
    document.getElementById('error-modal-content').innerText = message;
    document.getElementById('error-modal').showModal();
}

// logout button
document.getElementById("logout").addEventListener("click", logout);
async function logout(event) {
    event.preventDefault();
    try {
        let res = await fetch("/auth/logout", { method: "POST" });
        let data = await res.json();
        // checking for any error in backend
        if (data.error) {
            // if there is error then show error modal
            throw new Error(data.error);
        }
        window.location.href = "/";
    } catch (error) {
        document.getElementById("error-modal-content").innerText = error.message;
        document.getElementById("error-modal").showModal();

    }
}

// account deletion
async function deleteAccount() {
    try {
        let res = await fetch("/auth/delete", {
            method: 'POST'
        })
        let data = await res.json();
        if (data.error) {
            throw new Error(data.error);
        }
        window.location.href = "/";

    } catch (error) {
        showErrorModal(error.message);
    }
}

// dashboard information which pops up everytime
document.addEventListener("DOMContentLoaded", showDashboardInfoModal);
async function showDashboardInfoModal() {
    document.getElementById("dashboard-info-modal").showModal();
}

//load details of user in placeholders of input fields
document.addEventListener("DOMContentLoaded", getUserData);
async function getUserData() {
    try {
        let res = await fetch("/dashboard/data", { method: 'POST' });
        let data = await res.json();
        if (data.error) {
            throw new Error(data.error);
        }
        // set values in the placeholders
        Object.keys(data).forEach(function(key, index) {
            if (key == 'destinationType') {
                document.getElementsByName(key)[0].value = data[key];
            } else if (data[key] == 'on') {
                document.getElementsByName(key)[0].checked = true;
            } else if (document.getElementsByName(key).length != 0) {
                //setting current info on placeholder
                document.getElementsByName(key)[0].placeholder = data[key];
            }
        });

    } catch (error) {
        showErrorModal(error.message);
    }
}

// data updation
document.querySelectorAll('form')[0].addEventListener('submit', updatePersonalDetails);
document.querySelectorAll('form')[1].addEventListener('submit', updateFeatureDetails);

async function updatePersonalDetails(event) {
    event.preventDefault();
    try {
        const form = new FormData(document.querySelectorAll("form")[0]);
        const query = Object.fromEntries(form.entries());
        const filteredQuery = {};
        //iterating over array and selecting only ones which are changed
        for (const key of Object.keys(query)) {
            if (query[key]) {
                filteredQuery[key] = query[key];
            }
        }
        // checking if object is empty or not
        if (JSON.stringify(filteredQuery) === '{}') {
            throw new Error("Please Update Any Field before raising any request!")
        }
        let updateResult = await fetch("/dashboard/update/personal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filteredQuery),
        });
        let data = await updateResult.json();

        if (data.error) {
            throw new Error(error);
        }
        alert("Data Updated Successfully!")
        window.location.href = '/dashboard';
    } catch (error) {
        showErrorModal(error.message);
    }
}

async function updateFeatureDetails(event) {
    event.preventDefault();
    try {
        const form = new FormData(document.querySelectorAll("form")[1]);
        const query = Object.fromEntries(form.entries());
        let updateResult = await fetch("/dashboard/update/features", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(query),
        });
        let data = await updateResult.json();

        if (data.error) {
            throw new Error(data.error);
        }
        alert("Information Updated Successfully!")
    } catch (error) {
        showErrorModal(error.message);
    }
}