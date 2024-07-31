// this function is to close the modal when X is pressed
function closeModal(modalID) {
    document.getElementById(modalID).close();
}

// this function is to show error modal wheneven needed
function showErrorModal(message) {
    document.getElementById("error-modal-content").innerText = message;
    document.getElementById("error-modal").showModal();
}

// to show otp modal and start timer
function showOtpModal() {
    document.getElementById('minutes').innerText = 1;
    document.getElementById('seconds').innerText = 59;
    document.getElementById("otp-modal").showModal();

    let timer = setInterval(() => {
        if (parseInt(document.getElementById("seconds").innerText) == 0) {
            if (parseInt(document.getElementById("minutes").innerText) == 0) {
                clearInterval(timer);
            } else {
                document.getElementById("seconds").innerText = 59;
                document.getElementById("minutes").innerText = parseInt(document.getElementById("minutes").innerText) - 1;

            }
        } else {
            document.getElementById("seconds").innerText = parseInt(document.getElementById("seconds").innerText) - 1;
        }
    }, 1000);


}
// form submission
document.querySelector("form").addEventListener("submit", sendOTP);
async function sendOTP(event) {
    // stopping page refresh
    event.preventDefault();
    // disabling Signup button so that requests can't be spammed
    document.getElementById("signup-button").disabled = true;
    document.getElementById("signup-button").innerHTML = '<span class="loading loading-dots loading-lg"></span>';

    try {
        //getting form data
        const form = new FormData(event.target);
        const dataObject = Object.fromEntries(form.entries());
        //checking for passwords before hand
        if (dataObject.password != document.getElementById("confirmPassword").value) {
            showErrorModal("Password Do Not Match!")
            return;
        }
        // sending only email in backend to generate otp for it
        const res = await fetch("/auth/otp/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: dataObject.email
            }),
        });
        const data = await res.json();
        // checking for any error in backend
        if (data.error) {
            // if there is error then show error modal
            throw new Error(data.error);
        }
        // if thers no error then show otp modal
        showOtpModal();

    } catch (error) {
        // in case of any error,error will be shown in error modal
        showErrorModal(error.message);
    } finally {
        // enabling signup button to allow client to send requests again
        document.getElementById("signup-button").disabled = false;
        document.getElementById("signup-button").innerHTML = '';
        document.getElementById("signup-button").innerText = 'SignUp';

    }
}

// to verify otp when user enters the otp
document.getElementById("otp-submit").addEventListener("click", verifyOTP);
async function verifyOTP(event) {
    // stopping any undesired effects
    event.preventDefault();
    // disabling otp submit button so that requests can't be spammed
    document.getElementById("otp-submit").disabled = true;
    document.getElementById("otp-submit").innerHTML = '<span class="loading loading-dots loading-lg"></span>';

    try {
        //getting otp entered by user
        const otp = document.getElementById("otp-input").value;
        const email = document.getElementsByName("email")[0].value;
        //checking for passwords before hand
        if (!otp) {
            throw new Error("Invalid OTP");
        }
        // sending only email in backend to generate otp for it
        const res = await fetch("/auth/otp/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                otp: parseInt(otp),
                email: email
            }),
        });
        let data = await res.json();
        // checking for any error in backend
        if (data.error) {
            // if there is error then show error modal
            throw new Error(data.error);
        }
        // if thers no error then register the user
        await registerUser();
    } catch (error) {
        // in case of any error,error will be shown in error modal
        showErrorModal(error.message);
    } finally {
        // enable submit button
        document.getElementById("otp-submit").disabled = false;
        document.getElementById("otp-submit").innerHTML = "";
        document.getElementById("otp-submit").innerText = "Submit";
    }
}


async function registerUser() {
    const form = new FormData(document.querySelector("form"));
    const dataObject = Object.fromEntries(form.entries());

    // sending data to backend
    try {
        const res = await fetch("/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataObject),
        });

        const data = await res.json();
        if (data.error) {
            throw new Error(data.error);
        }

        // redirecting to dashboard
        window.location.href = "/dashboard"

    } catch (error) {
        document.getElementById("error-modal-content").innerText = error.message;
        document.getElementById("error-modal").showModal();
    }
}