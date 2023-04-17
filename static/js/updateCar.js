function updateCar(_id, insured, gasolinePowered, damaged, fourByFour) {
    const canBeUpdated = confirm(
        `Are you sure you want to update car with id = ${_id}?`
    );

    if (canBeUpdated) {
        const data = JSON.stringify({
            id: _id,
            object: {
                insured: toBoolean(insured.value),
                gasolinePowered: toBoolean(gasolinePowered.value),
                damaged: toBoolean(damaged.value),
                fourByFour: toBoolean(fourByFour.value),
            },
        });

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        };

        fetch("/updateCar", options).catch((error) => console.log(error));
        window.location = "/editCars";
    }
}

function toBoolean(isTrue) {
    if (isTrue === "true") {
        return true;
    } else if (isTrue === "false") {
        return false;
    } else if (isTrue === "null") {
        return null;
    }
}
