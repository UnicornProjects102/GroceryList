function generateNoteHtml(value, id){
    return `<span id="${id}" class="grocery-item-title"><span class="grocery-item-value">${value}</span><div class="tooltip"><img src="/images/asterisk-solid.svg" alt="" srcset=""></div></span>
    <input type="hidden" value="${value}" />
<div class="grocery-item-icons">

<a href="#" class="grocery-item-delete">
<img width="15rem" src="images/trash-alt.svg" alt="trash">

</a>
<a href="#" class="grocery-item-check">
<img width="15rem" src="images/check-square.svg" alt="check">

</a>
<a href="#" class="grocery-item-edit">
edit
</a>
<a href="#" class="grocery-item-save">
save
</a>
</div>`;
}