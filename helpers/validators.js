function validateInputValue(value)
{
    if (value === "") {
        showAction(addItemsAction, "Please, add a grocery item.");
        return false;
    } 
    return true;
}