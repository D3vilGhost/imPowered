// function to close modal when clicked on x button
function closeModal(modalId) {
    document.getElementById(modalId).close();
}
// this function is to show error modal wheneven needed
function showErrorModal(message) {
    document.getElementById("error-modal-content").innerText = message;
    document.getElementById("error-modal").showModal();
}

function showInfoModal(data) {
    let features = {
        wheelchair: 'Wheel Chairs',
        lift: 'Lift',
        ramps: 'Ramps',
        restrooms: 'Restrooms',
        helpers: 'Helpers',
        announcementSystem: 'Announcement System',
        automaticDoors: 'Automatic Doors',
        accessibleToilets: 'Accessible Toilets'
    };
    Object.keys(data).forEach(function(key, index) {
        if (document.getElementById(key)) {
            if (features[key] && data[key] != '') {
                document.getElementById(key).innerText = features[key];
            } else {
                document.getElementById(key).innerText = data[key];
            }
        }
    });
    document.getElementById("info-modal").showModal();
}
//showing information on how to use search bar on page load
document.addEventListener("DOMContentLoaded", showHowToUseSearchModal);

function showHowToUseSearchModal() {
    document.getElementById("search-info-modal").showModal();
}

// requesting search results from user
document.querySelector("form").addEventListener("submit", getSearchResults);
async function getSearchResults(event) {
    try {
        event.preventDefault();
        // Get form details
        document.getElementById("search-result").innerHTML = '';
        const form = new FormData(document.querySelector("form"));
        const searchQuery = Object.fromEntries(form.entries());
        console.log(searchQuery);
        if (searchQuery.destinationType == "-") {
            return showErrorModal("Please Select A Destination Type!")
        }
        let searchResults = await fetch("/search/results", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(searchQuery),
        });
        let data = await searchResults.json();
        if (data.error) {
            throw new Error(error);
        }
        if (data.length == 0) {
            throw new Error("No Result Found!");
        }
        data.forEach((element, index, array) => {
            addSearchResult(element.email, element.name, element.address)

        });
        // searchResults.forEach((result) => addSearchResult(result));

    } catch (error) {
        showErrorModal(error.message);
    }

}

// this controller gets information for a particular entity on click

async function getInformation(email) {
    try {
        let infoResult = await fetch("/search/info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email }),
        });
        let infoData = await infoResult.json();
        if (infoData.error) {
            throw new Error(infoData.error);
        }
        showInfoModal(infoData);
    } catch (error) {
        showErrorModal(error.message);
    }
}

// this function adds search results elements
function addSearchResult(email, name, address) {
    let div = document.createElement('div');
    div.setAttribute('class', 'p-3 border-2 border-neutral-700 rounded-lg w-3/4 hover:scale-105 hover:cursor-pointer hover:bg-base-300 hover:border-primary');
    div.setAttribute('onclick', `getInformation('${email}')`);
    div.innerHTML = `<div>
                        <div class="font-bold">Name:</div>
                        <div>${name}</div>
                    </div>
                    <br>
                    <div>
                        <div class="font-bold">Address:</div>
                        <div>${address}</div>
                    </div>
                    `;

    document.getElementById("search-result").appendChild(div);
}