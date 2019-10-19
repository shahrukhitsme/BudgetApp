//BUDGET Controller
var budgetController = (function(){

})();


//UI Controller
var UIController = (function(){
    
})();


// GLOBAL APP Controller
var controller = (function(budgetCtrl,UICtrl){
    
    var ctrlAddItem = function(){
        //1. Get Input Data
        //2. Add the item to the budget Controller
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budget on the UI
        console.log('It works');
    }

    document.querySelector('.add__btn').addEventListener('click', function() {
        ctrlAddItem();
    });

    document.addEventListener('keypress', function(event){
        //code is 13 in case of return key press. Some browsers don't support 'keyCode', so 'which' is for them
          if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
          }
    });

})(budgetController,UIController);