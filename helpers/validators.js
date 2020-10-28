function validateInputValue(value) {
    if (value === "") {
        showAction(addItemsAction, "The field cannot be empty.");
        return false;
    }
    return true;
}