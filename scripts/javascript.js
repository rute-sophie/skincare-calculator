/* Global Variables */
document.oncontextmenu =new Function("return false;")
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
  debugger;
  var glycerin = document.getElementById('ingredient_percentage_2').value;
  var chelator = document.getElementById('ingredient_percentage_3').value;
  var water_sol1 = document.getElementById('ingredient_percentage_5').value;
  var water_sol2 = document.getElementById('ingredient_percentage_6').value;
  var water_sol3 = document.getElementById('ingredient_percentage_17').value;
  var water_sol4 = document.getElementById('ingredient_percentage_18').value;
  var oil1 = document.getElementById('ingredient_percentage_7').value;
  var oil2 = document.getElementById('ingredient_percentage_8').value;
  var opt_oil1 = document.getElementById('ingredient_percentage_9').value;
  var opt_oil2 = document.getElementById('ingredient_percentage_10').value;
  var cetearyl = document.getElementById('ingredient_percentage_11').value;
  var emulsifier = document.querySelector('#emulsifier-blend').value;
  var fragance = document.getElementById('ingredient_percentage_14').value;
  var cooldown_optoil1 = document.getElementById('ingredient_percentage_15').value;
  var cooldown_optoil2 = document.getElementById('ingredient_percentage_16').value;

  if (batch.value === "") {
    functionAlert("Please insert value in Batch Size field.");
    return false;
  }

  else if((glycerin == "" || chelator == "" || cetearyl == "")) {
    functionAlert("Mandatory fields are not filled up. Please insert the missing values.");
    return false;
  }

  else if ((oil1 == "" || oil2 == "")) {
    functionAlert("Please select an option in the Product & Skin type field above.");
    return false;
  }
  else if (chelator > 0.2) {
    functionAlert("Please don't insert more than 0.2% for Chelator.");
    return false;
  }
/*  else if (glycerin < 1 || glycerin > 5) {
    debugger;
    functionAlert("For Glycerin, please only insert values between 1 and 5%.");
    return false;
  }
  */
  else if (emulsifier == "") {
    functionAlert("Please select an option from the Emulsifier dropdown in the OIL phase.");
    return false;
  }
  else if (fragance > 0.8) {
    functionAlert("You added more than 0.8% for fragance which is too much. Recommended % (if allowed by IFRA) are up to 0.3% for the face and up to 0.8% for the body.");
    return false;
  }
  else if ((opt_oil1 > 1) || (opt_oil2 > 1)) {
    functionAlert("Please make sure that the percentages for oil soluble actives in the Oil Phase are less than 1%.");
    return false;
  }
  else if ((cooldown_optoil1 > 1) || (cooldown_optoil2 > 1)) {
    functionAlert("Please make sure that the percentages for oil soluble heat sensitives in the Cool Down Phase are less than 1%.");
    return false;
  }
  else if ((water_sol1 > 20) || (water_sol2 > 20) || (water_sol3 > 20) || (water_sol4 > 20) ) {
    functionAlert("You added a value too high for ingredients.");
    return false;
  }

  else calculatePercentages();
}

/* 2nd step - calculate percentages */

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
    result.value = ((percentagevalue/100.0) * batch.value).toFixed(3);

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
  else emulsifierCounter = emulsifier_blend_verified_value.toFixed(3);

  emulsifier_blend.value = emulsifierCounter + "%";
  var emulsifier_blend_result = document.getElementById('grams_ounces_12');
  emulsifier_blend_result.value = ((emulsifierCounter/100.0) * batch.value).toFixed(3);

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
  water.value = waterValue.toFixed(3) + "%";
  var result = document.getElementById('grams_ounces_1');
  result.value = ((waterValue/100) * batch.value).toFixed(3);

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
    var ingredientCostValue = parseFloat(ingredientCost.value).toFixed(3);
    debugger;
    if (document.getElementById('grams-batch').checked){
    formulaCostValue = (batchGramsOuncesValue * ingredientCostValue / 1000);
    }
    else {
      formulaCostValue = (batchGramsOuncesValue * ingredientCostValue / 16);
    }
    formulaCost.value = formulaCostValue.toFixed(3);
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
  totalBatch.value = batchCounter.toFixed(3);
  totalIngredientCost.value = ingredientCostCounter.toFixed(3);
  totalFormulaCost.value = formulaCostCounter.toFixed(3);
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

