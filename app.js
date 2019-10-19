//BUDGET Controller
var budgetController = (function(){

})();


//UI Controller
var UIController = (function(){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };

    return {
        getInput: function(){
            return{
                type : document.querySelector(DOMstrings.inputType).value,  //will be either inc for '+' or exp for '-'
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();


// GLOBAL APP Controller
var controller = (function(budgetCtrl,UICtrl){
    
    var setupEventListeners = function(){
        var DOMstrings = UIController.getDOMstrings();

        document.querySelector(DOMstrings.inputButton).addEventListener('click', function() {
            ctrlAddItem();
        });

        document.addEventListener('keypress', function(event){
            //code is 13 in case of return key press. Some browsers don't support 'keyCode', so 'which' is for them
              if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
              }
        });
    };

    var ctrlAddItem = function(){
        //1. Get Input Data
        var input = UICtrl.getInput();

        //2. Add the item to the budget Controller
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budget on the UI
    };

    return {
        init: function(){
            console.log('Application has started');
            setupEventListeners();
        }
    }

})(budgetController,UIController);

controller.init();