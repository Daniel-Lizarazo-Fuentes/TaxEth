interface Order {
  amount: number;
  ISIN: string;
}
let orders:Order[] = [];
let baseOrder = {
  ISIN: "",
  amount: 0,
};
function calcOrderValue(
  minValue: number,
  maxValue: number,
  investAmount: number,
  ISIN: string,
  orders:Order[]
) {
  //Reset baseOrder
  baseOrder.ISIN = ISIN;
  baseOrder.amount = 0;
  orders = [];
  // maxRemainder for seeing is an easy calculation can be done.
  let maxRemainder =
    Math.round(((investAmount % maxValue) + Number.EPSILON) * 100) / 100;
  let minRemainder =
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
    const numberOfOrders = Math.trunc(investAmount / minValue);

    baseOrder.amount = minValue;
    while (orders.length < numberOfOrders) {
      orders.push(Object.assign({}, baseOrder));
      investAmount -= Math.round((minValue + Number.EPSILON) * 100) / 100;
    }

    // if the above already makes an array which then this will not be executed
    if (investAmount != 0) {
      let i = 0;
      let interval = maxValue - minValue;
      // for all orders
      while (i < orders.length) {
        // if minRemainder > interval this means that the amount to be invested is greater or equal to than the inteval so one order can be filled to the max
        if (minRemainder >= interval) {
          orders[i].amount += interval;
          minRemainder -= interval;
          investAmount -= interval;
        }
        // if minRemainder < interval this means that the amount to be invested is smaller than the interval so it is completely added to the orderamount and then set to 0
        else if (minRemainder < interval && minRemainder != 0) {
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

  
function toLog(minValue: number, maxValue: number, maxRemainder: number, investAmount: number, orders:Order[]) {
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
