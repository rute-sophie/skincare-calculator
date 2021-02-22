var batch = document.getElementById('batch-size');
var batch_column = document.getElementById('batch-column');
var batch_value = batch.value;
var mass_column = document.getElementById('mass-column');

var selectElement = document.querySelector('#product-skin-type');

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

var calculate_button = document.getElementById('calculate-button');
calculate_button.onclick = verifyPercentages;

function verifyPercentages(){

  var total = 0;
  var i;

  if (batch.value === "") {
    alert ("Please insert value in Batch Size field");
    return false;
  }
  else {
    for (i=1; i<19; i++){
      var percentage = document.getElementById('ingredient_percentage_'+i);
      if( (((i>1) && (i<5)) || (i==11) || (i==13)) && (percentage.value == "")) {
        alert ("Mandatory fields are not filled up");
        return false;
      }
      if ((i>6) && (i<9) && (percentage.value == "")) {
        alert ("Please select an option in the Product & Skin type field above");
        return false;
      }
      if ((i>8) && (i<11) && (percentage.value >= 1)) {
        debugger;
        alert ("Please make sure that the percentages for oil soluble active in the Oil Phase are less than 1%");
        return false;
      }
      if ((i>14) && (i<17) && (percentage.value >= 1)) {
        debugger;
        alert ("Please make sure that the percentages for oil soluble heat sensitive in the Cool Down Phase are less than 1%");
        return false;
      }
      if (percentage == null) continue;
    }

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

function validatePercentage(form) {

  document.calculatorForm.action = '/Calculators/Batch_Size_Calculator.aspx'
  document.calculatorForm.target = '';
  var i = 0;
  var percent = 0;
  var totalPercent = 0;
  var result = true;
  with (form) {
    for (i = 1; i <= 20; i++) {
      var percentString = eval('percent_' + i).value;
      if (percentString != "") {
        if (parseFloat(percentString)) {
          if (parseFloat(percentString) > 0) {
            percent = parseFloat(percent) + parseFloat(percentString);
          } else {
            alert("Amount values cannot be a negative number.");
            return false;
          }
        } else {
          alert("Amount values need to be a number between 1 and 100%.");
          return false;
        }
      }
    }
  }
  percent = Math.round(percent * 100) / 100;
  if (percent > 100) {
    result = false;
    alert("The total percent of additives cannot be more than 100%. Please correct this.");
  } else {
    if (percent != 100) {
      alert("The total amount of ingredients needs to add up to 100%");
      result = false;
    }
  }
  return result;
}

function printView() {
  var cID1 = '/Calculators/Batch_Size_Calculator_Print.aspx';
  var newWin = window.open(cID1, "OpenNewPage", "width=750,height=700,location=0,menubar=0,resizable=1,scrollbars=1,status=1,titlebar=1,toolbar=0,screenX=50,left=50,screenY=30,top=50");

  if (validatePercentage(document.calculatorForm)) {
    document.calculatorForm.action = cID1;
    document.calculatorForm.target = 'OpenNewPage';
    document.calculatorForm.submit();
  }
  return true;
}

function resetForm(form) {

  if (confirm("Are you sure you want to start over?")) {
    document.calculatorForm.action = '/Calculators/Batch_Size_Calculator.aspx';
    document.calculatorForm.startOver.value = "true";
    document.calculatorForm.target = '';
    document.calculatorForm.submit();
  }
  return true;
}

function OpenNewPage(cID1) {
  var cID1;
  var newWin = window.open(cID1, "OpenNewPage", "width=600,height=220,location=0,menubar=0,resizable=1,scrollbars=1,status=1,titlebar=1,toolbar=0,screenX=50,left=50,screenY=30,top=50");
  newWin.focus();
}

function displayTotal() {
  var i = 0;
  var total = 0;
  for (i = 1; i < 20; i++) {
    var tem = eval('document.calculatorForm.percent_' + i);
    if (parseFloat(tem.value)) {
      total = parseFloat(total) + parseFloat(tem.value);
    }
  }
  document.calculatorForm.totalBatchVolume.value = total;
}
