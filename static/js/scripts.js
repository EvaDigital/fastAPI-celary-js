function getTasksList() {
    fetch("http://0.0.0.0:8000/tasks/list/")
    .then(response => response.json())
    .then(data => {
        const tasks = data.message
        const taskList = document.getElementById("task-list");

        taskList.innerHTML = "";
        
        tasks.forEach(task => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item li-task";

            const taskInfoBlock = document.createElement("div");

            const titleElement = document.createElement("h4");
            titleElement.textContent = task.title;

            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = task.description;

            const isCompletedElement = document.createElement("p")
            isCompletedElement.textContent = `is completed: ${task.is_completed}`;

            taskInfoBlock.appendChild(titleElement);
            taskInfoBlock.appendChild(descriptionElement);
            taskInfoBlock.appendChild(isCompletedElement);

            const deleteButton = document.createElement("a");
            deleteButton.className = "btn btn-danger btn-sm float-right";
            deleteButton.textContent = "Удалить";
            deleteButton.setAttribute("onclick", `deleteTask(${task.id})`);

            listItem.appendChild(taskInfoBlock);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);
        });

    })
    .catch(error => {
        console.error("error:", error);
    });
}

getTasksList()

function createTask(event) {
    event.preventDefault();
    $("#createTaskModal").modal("hide");
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const taskData = {
        title: title,
        description: description,
        is_completed: false
    };

    const startTime = performance.now();
    fetch("http://0.0.0.0:8000/tasks/create/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        const responseTimeElement = document.getElementById("response-time");
        responseTimeElement.textContent = `Request execution time: ${executionTime.toFixed(2)} ms`;

        if (executionTime > 500) {
            const warningElement = document.getElementById("warning");
            warningElement.textContent = "Delay exceeds 500 ms!";
        } 

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";

        $("#task-list").empty();
        getTasksList();
    })
    .catch(error => {
        console.error("Error:", error);
    });

}

function deleteTask(id) {
    const startTime = performance.now();
    fetch(`http://0.0.0.0:8000/tasks/delete/${id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        const responseTimeElement = document.getElementById("response-time");
        responseTimeElement.textContent = `Request execution time: ${executionTime.toFixed(2)} ms`;

        if (executionTime > 500) {
            const warningElement = document.getElementById("warning");
            warningElement.textContent = "Delay exceeds 500 ms!";
        } 

        $("#task-list").empty();
        getTasksList()
    })
    .catch(error => {
        console.error("Error:", error);
    });
}


function getWeather(event) {
    event.preventDefault(); 

    const cityInput = document.getElementById("cityInput");
    const weatherInfo = document.getElementById("weatherInfo");

    const city = cityInput.value;

    fetch(`http://0.0.0.0:8000/weather/${city}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.error) {
                weatherInfo.textContent = `Error: ${data.error}`;
            } else {
                const weatherDescription = data.weather.weather[0].description;
                const temperature = parseInt(data.weather.main.temp - 273.15); 

                weatherInfo.innerHTML = `
                    <p class='weather-answer'>Weather in ${city} - ${temperature}°C (${weatherDescription})</p>
                `;
            }
        })
        .catch(error => {
            weatherInfo.textContent = `Error: ${error}`;
        });
}




