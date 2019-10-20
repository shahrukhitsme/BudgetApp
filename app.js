//BUDGET Controller
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome>0)
            this.percentage = Math.round((this.value / totalIncome) * 100);
        else
            this.percentage = -1;
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp : [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }, 
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(input){
            var newItem;

            if(data.allItems[input.type].length > 0) //existing last ID + 1
                ID = data.allItems[input.type][data.allItems[input.type].length - 1].id + 1;
            else
                ID = 0; //for the first entry

            if(input.type === 'exp'){
                newItem = new Expense(ID, input.description, input.value);
            } else if(input.type === 'inc'){
                newItem = new Income(ID, input.description, input.value);
            }

            data.allItems[input.type].push(newItem);
            data.totals[input.type] += input.value;

            return newItem;
        },

        deleteItem: function(type, id){
            var ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });
            return allPerc;
        },

        calculateBudget: function(){
            
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if(data.totals.inc!=0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) *100);
            else
                data.percentage = -1;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    };

})();


//UI Controller
var UIController = (function(){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        totalIncome: '.budget__income--value',
        totalExpense: '.budget__expenses--value',
        budgetConatiner: '.budget__value',
        expensePercentage: '.budget__expenses--percentage',
        listContainer: '.container',
        deleteButton: '.ion-ios-close-outline',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    return {
        getInput: function(){
            return{
                type : document.querySelector(DOMstrings.inputType).value,  //will be either inc for '+' or exp for '-'
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type){
            var html, newHtml, element;

            //Create HTML string with placeholder text
            if(type == 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type == 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%exp%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        deleteListItem: function(selectorID){
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        clearFields: function(){
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            //slice method is for arrays and returns an array. fields is a list and we want to convert it into an array
            //We would trink the interpreator and use the slice method for fields too. But we would have
            //to use the call method to bind the slice and pass the fields list as its 'this'

            fieldsArr.forEach(function(currentValue, index, array){
                currentValue.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(inc, exp, bdgt, expPercent){
            var totalIncome,totalExpense,budget,expensePercentage;
            totalIncome = document.querySelector(DOMstrings.totalIncome);
            totalExpense = document.querySelector(DOMstrings.totalExpense);
            budget = document.querySelector(DOMstrings.budgetConatiner);
            expensePercentage = document.querySelector(DOMstrings.expensePercentage);

            totalIncome.innerHTML = inc;
            totalExpense.innerHTML = exp;
            budget.innerHTML = bdgt;
            expensePercentage.innerHTML = expPercent==-1?'---':expPercent;
        },

        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
            //returns a nodelist
            //It does not have a foreach method. So, we create a foreach function for a nodelist

            var nodeListForEach = function(list, callback){
                for(var i=0; i< list.length; i++){
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index){

                if(percentages[index] > 0)
                    current.textContent = percentages[index] + '%';
                else
                current.textContent = '---';

            });
        },

        displayDate: function(){
             var now = new Date();
             var month = now.getMonth();
             var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
             var year = now.getFullYear();
             document.querySelector(DOMstrings.dateLabel).innerHTML = months[month]+', '+year;
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

        document.querySelector(DOMstrings.listContainer).addEventListener('click', ctrlDeleteItem)
    };

    var updateBudget = function(){
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        var budgetObj = budgetCtrl.getBudget();

        //3. Display the budget on the UI
        UICtrl.displayBudget(budgetObj.totalInc, budgetObj.totalExp, budgetObj.budget, budgetObj.percentage);
    };

    var updatePercentages = function(){

        //1. Calculate Percentages
        budgetCtrl.calculatePercentages();

        //2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        //3. Update the UI with the new parameters
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function(){
        var input, newItem;

        //1. Get Input Data
        input = UICtrl.getInput();

        if(input.description!="" && input.value>0)
        {
            //2. Add the item to the budget Controller
            newItem = budgetController.addItem(input);

            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();

            //4. Update the budget
            updateBudget();

            //5. Calculate and Update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event){
        var DOMstrings = UIController.getDOMstrings();
        var itemID, splitID, type, ID;

        if('.'+event.target.className == DOMstrings.deleteButton)
        {
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if(itemID){
                splitID = itemID.split('-');
                type = splitID[0];
                ID = parseInt(splitID[1]);
                
                //1. Delete the item from the data structure
                budgetCtrl.deleteItem(type, ID);

                //2. Delete the item from the UI
                UICtrl.deleteListItem(itemID);

                //3. Update and show the new budget
                updateBudget();

                //4. Calculate and Update percentages
                updatePercentages();
            }
        }
    };

    return {
        init: function(){
            console.log('Application has started');
            setupEventListeners();
            UICtrl.displayDate();
        }
    }

})(budgetController,UIController);

controller.init();