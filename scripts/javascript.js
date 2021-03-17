/* Global Variables */
var batch = document.getElementById('batch-size');
var batch_column = document.getElementById('batch-column');
var batch_value = batch.value;
var mass_column = document.getElementById('mass-column');
var selectElement = document.querySelector('#product-skin-type');

/* Event Listener for main dropbox */
selectElement.addEventListener('change', (event) => {
  var oil_ester_1 = document.querySelector('#oil-ester-1');
  var oil_ester_2 = document.querySelector('#oil-ester-2');

  switch (event.target.value){
    case "oily-skin-cream":
    ingredient_percentage_7.value = "2%";
    ingredient_percentage_8.value = "2%";
    break;
    case "normal-skin-cream":
    ingredient_percentage_7.value = "5%";
    ingredient_percentage_8.value = "5%";
    break;
    case "dry-skin-cream":
    ingredient_percentage_7.value = "7%";
    ingredient_percentage_8.value = "7%";
    break;
  }
});

/* Event Listener for Calculate button */
var calculate_button = document.getElementById('calculate-button');
calculate_button.onclick = verifyPercentages;

/* Alert box */
function functionAlert(msg, myYes) {
          var confirmBox = $("#confirm");
          confirmBox.find(".message").text(msg);
          confirmBox.find(".yes").unbind().click(function() {
             confirmBox.hide();
          });
          confirmBox.find(".yes").click(myYes);
          confirmBox.show();
       }

/* 1st step - verify percentages */
function verifyPercentages(){

  var total = 0;
  var i;

  if (batch.value === "") {
    functionAlert("Please insert value in Batch Size field.");
    return false;
  }

    var glycerin = document.getElementById('ingredient_percentage_'+2);
    var chelator = document.getElementById('ingredient_percentage_'+3);
    var cetearyl = document.getElementById('ingredient_percentage_'+11);

    if((glycerin.value == "" || chelator.value == "" || cetearyl.value == "")) {
      functionAlert("Mandatory fields (with the *) are not filled up. Please insert the missing values.");
      return false;
    }

    for (i=1; i<19; i++){
      var percentage = document.getElementById('ingredient_percentage_'+i);
      if ((i>6) && (i<9) && (percentage.value == "")) {
        functionAlert("Please select an option in the Product & Skin type field above.");
        return false;
      }
      if ((i=2) && ((percentage.value < 1) || (percentage.value > 5))) {
        debugger;
        functionAlert("For Glycerin, please only insert values between 1 and 5%.");
        return false;
      }
      if ((i=3) && ((percentage.value < 0.05) || (percentage.value > 0.2))) {
        functionAlert("For Chelator, please only insert values between 0.05% and 0.2%.");
        return false;
      }
      if ((i>8) && (i<11) && (percentage.value >= 1)) {
        functionAlert("Please make sure that the percentages for oil soluble active in the Oil Phase are less than 1%.");
        return false;
      }
      if ((i>14) && (i<17) && (percentage.value >= 1)) {
        functionAlert("Please make sure that the percentages for oil soluble heat sensitive in the Cool Down Phase are less than 1%.");
        return false;
      }
      if (percentage == null) continue;

    calculatePercentages();
  }
}

function calculatePercentages(){
  var j;
  var emulsifierCounter = 0;

  for (j = 1; j < 19; j++) {
    var result = document.getElementById('grams_ounces_' + j);
    var percentage = document.getElementById('ingredient_percentage_'+j);
    if (percentage.value === "") {
      result.value = "";
      continue;
    }
    var percentagevalue = parseFloat(percentage.value);
    result.value = ((percentagevalue/100.0) * batch.value).toFixed(2);

    if (((j>6) && (j<12)) || ((j>13) && (j<17))) {
      emulsifierCounter += percentagevalue;
    }
  }
  var emulsifier_blend = document.getElementById('ingredient_percentage_12');
  var emulsifier_blend_verified_value = emulsifierCounter * 0.25;

  if(emulsifier_blend_verified_value < 3)
  emulsifierCounter = 3;
  else if(emulsifier_blend_verified_value > 7)
  emulsifierCounter= 7;
  else emulsifierCounter = emulsifier_blend_verified_value.toFixed(2);

  emulsifier_blend.value = emulsifierCounter + "%";
  var emulsifier_blend_result = document.getElementById('grams_ounces_12');
  emulsifier_blend_result.value = ((emulsifierCounter/100.0) * batch.value).toFixed(2);

  calculateWaterPercentage();
}

function calculateWaterPercentage (){
  var percentageSumCounter = 0;

  for (i = 2; i < 19; i++) {
    var finalPercentage = document.getElementById('ingredient_percentage_'+ i);

    if(finalPercentage.value == '') continue;
    var finalPercentagevalue = parseFloat(finalPercentage.value);

    percentageSumCounter += finalPercentagevalue;
  }

  var water = document.getElementById('ingredient_percentage_1');
  var waterValue = 100 - percentageSumCounter;
  water.value = waterValue.toFixed(2) + "%";
  var result = document.getElementById('grams_ounces_1');
  result.value = ((waterValue/100) * batch.value).toFixed(2);

  calculateIngredientCost();
}

function calculateIngredientCost (){
  for (i = 1; i < 19; i++) {
    var ingredientCost = document.getElementById('ingredient_cost_'+ i);
    if(ingredientCost.value == '') continue;
    var formulaCost = document.getElementById('cost_formula_'+ i);
    var batchGramsOunces = document.getElementById('grams_ounces_'+ i);
    if(batchGramsOunces.value == '') continue;
    var batchGramsOuncesValue = parseFloat(batchGramsOunces.value);
    var ingredientCostValue = parseFloat(ingredientCost.value).toFixed(2);
    formulaCostValue = batchGramsOuncesValue * ingredientCostValue;
    formulaCost.value = (formulaCostValue/1000).toFixed(2);
  }

  calculateTotals();
}

function calculateTotals(){
  debugger;
  var percentageCounter = 0;
  var batchCounter = 0;
  var ingredientCostCounter = 0;
  var formulaCostCounter = 0;

  for (i = 1; i < 19; i++) {
    var percentage = document.getElementById('ingredient_percentage_'+ i);
    if(percentage.value == '') continue;
    var percentageValue = parseFloat(percentage.value);
    percentageCounter += percentageValue;
  }

  for (i = 1; i < 19; i++) {
    var batch = document.getElementById('grams_ounces_'+ i);
    if(batch.value == '') continue;
    var batchValue = parseFloat(batch.value);
    batchCounter += batchValue;
  }

  for (i = 1; i < 19; i++) {
    var ingredientCost = document.getElementById('ingredient_cost_'+ i);
    if(ingredientCost.value == '') continue;
    var ingredientCostValue = parseFloat(ingredientCost.value);
    ingredientCostCounter += ingredientCostValue;
  }

  for (i = 1; i < 19; i++) {
    var formulaCost = document.getElementById('cost_formula_'+ i);
    if(formulaCost.value == '') continue;
    var formulaCostValue = parseFloat(formulaCost.value);
    formulaCostCounter += formulaCostValue;
  }

  var totalPercentage = document.getElementById('total_percentage');
  var totalBatch = document.getElementById('total_batch');
  var totalIngredientCost = document.getElementById('total_ingredient_cost');
  var totalFormulaCost = document.getElementById('total_formula_cost');

  totalPercentage.value = percentageCounter.toFixed() + "%";
  totalBatch.value = batchCounter.toFixed(2);
  totalIngredientCost.value = ingredientCostCounter.toFixed(2);
  totalFormulaCost.value = formulaCostCounter.toFixed(2);
}

function gramsOrOuncesCheck() {
  if (document.getElementById('grams-batch').checked){
    batch_column.innerHTML = 'Grams to be added';
    mass_column.innerHTML = 'Ingredient cost per kg';
  }
  else {
    batch_column.innerHTML = 'Ounces to be added';
    mass_column.innerHTML = 'Ingredient cost per pound';
  }
}

function currencyCheck() {
/*  if (document.getElementById('euro-radio').checked){
    mass_column.innerHTML = 'Ingredient cost per kg';
  }
  else {
    mass_column.innerHTML = 'Ingredient cost per pound';
  } */
}
