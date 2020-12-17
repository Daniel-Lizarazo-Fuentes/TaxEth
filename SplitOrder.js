var orders = [];
baseOrder = {
  ISIN: "",
  amount: 0,
};
function calcOrderValue(minValue, maxValue, investAmount, ISIN, orders) {
  //Reset baseOrder
  baseOrder.ISIN = ISIN;
  baseOrder.amount = 0;
  orders = [];
  // maxRemainder for seeing is an easy calculation can be done.
  var maxRemainder =
    Math.round(((investAmount % maxValue) + Number.EPSILON) * 100) / 100;
  var minRemainder =
    Math.round(((investAmount % minValue) + Number.EPSILON) * 100) / 100;

  // if maxRemainder is 0 then we just divide the to be invested amount by the max order value and fill that itno an array.
  if (maxRemainder == 0) {
    baseOrder.amount = maxValue;
    while (investAmount != 0) {
      orders.push(baseOrder);
      investAmount -= maxValue;
    }
  }
  // if maxRemainder for max orders isn't  0 then we have to do some more complicated calculations
  else {
    //we first make an array with orders of minvalue, number of orders is cacluated by the taking the minimal amount of orders of min value to statisfy the investAmount minus the remainder
    numberOfOrders = Math.trunc(investAmount / minValue);

    baseOrder.amount = minValue;
    while (orders.length < numberOfOrders) {
      orders.push(Object.assign({}, baseOrder));
      investAmount -= Math.round((minValue + Number.EPSILON) * 100) / 100;
    }

    // if the above already makes an array which then this will not be executed
    if (investAmount != 0) {
      var i = 0;
      var interval = maxValue - minValue;
      while (i < orders.length) {
        if (minRemainder > interval) {
          orders[i].amount += interval;
          minRemainder -= interval;
          investAmount -= interval;
        } else if (minRemainder < interval && minRemainder != 0) {
          orders[i].amount +=
            Math.round((minRemainder + Number.EPSILON) * 100) / 100;
          investAmount =
            Math.round((investAmount + Number.EPSILON) * 100) / 100 -
            Math.round((minRemainder + Number.EPSILON) * 100) / 100;
          minRemainder = 0;
        }
        i++;
      }
    }
  }
  toLog(minValue, maxValue, maxRemainder, investAmount, orders);
}

function toLog(minValue, maxValue, maxRemainder, investAmount, orders) {
  let i = 0;
  let totalAmount = 0;
  while (i < orders.length) {
    console.log(orders[i]);
    totalAmount += orders[i].amount;
    i++;
  }
  console.log("Total invested: " + totalAmount);
  console.log("Lenght of array/amount of orders: " + orders.length);
  console.log("Total remaining: " + investAmount);
  console.log("Boundiaries: [" + minValue + ";" + maxValue + "]");
  console.log("maxRemainder: " + maxRemainder);
}

calcOrderValue(1, 1.5, 40.68, "FR0010208488", orders);
calcOrderValue(1, 1.1, 7.42, "GB00B0LCW083", orders);
