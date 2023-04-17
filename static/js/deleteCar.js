function deleteCar(_id) {
    const canBeDeleted = confirm(
        `Are you sure you want to delete car with id = ${_id}?`
    );

    if (canBeDeleted) {
        const data = JSON.stringify({
            id: _id,
        });

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        };

        fetch("/deleteCar", options).catch((error) => console.log(error));
        window.location = "/carsList";
    }
}
