'use strict';

var request  = require('requestretry');
var md5 = require('MD5');

/**
 * OKCoin connects to the OKCoin.com API
 * @param {String} api_key    
 * @param {String} secret API Secret
 */
function OKCoin(api_key, secret) {
  var self = this;

  var config = {
    url: 'https://www.okcoin.com/api/',
    version: 'v1',
    api_key: api_key,
    secret: secret,
    timeoutMS: 18000
  };

  /**
  * Public methods supported for
  * Spot trading
  */
  
  /**
   * Get Price Ticker
   * @param {String} btc_usd    ltc_usd 
   */
   
  function ticker(symbol, callback) {
    var path = config.version +  '/ticker.do' + '?symbol=' + symbol;
    return publicMethod(path, callback);
  }
  
  /**
   *  Get Market Depth
   * @param {String} btc_usd    ltc_usd
   * @param {Number} value: must be between 1 - 200 
   * @param {Number} value: 1 (merge depth)
   */
   
  function depth(symbol, depth_size, merge, callback) {
    var path = config.version +  '/depth.do' + '?symbol=' + symbol;
      if (0 < depth_size && depth_size < 201)
      path+= '&size=' + depth_size;
      if (merge==1)
      path+= '&merge=' + merge;
    return publicMethod(path, callback);
  }
  
    /**
   *   Get Trade Recently 600
   * @param {String} btc_usd    ltc_usd
   * @param {Number} get recently 600 pieces of data starting from the given tid (optional) 
   */
  
  function trades(symbol, since_tid, callback) {
    var path = config.version +  '/trades.do' + '?symbol=' + symbol;
    if (typeof since_tid == 'number')
    path+= '&since=' + since_tid;
    return publicMethod(path, callback);
  }
  
  //TODO add Get BTC/LTC Candlestick Data
  
    /**
  * Public methods supported for
  * Futures trading
  */
  
    /**
   *   Get OKCoin Future Price
   * @param {String} btc_usd    ltc_usd
   * @param {String} this_week   next_week   quarter
   */
  
  function future_ticker(symbol, contract_type, callback) {
    var path = config.version +  '/future_ticker.do' + '?symbol=' + symbol + '&contract_type=' + contract_type;
    return publicMethod(path, callback);
  }

    /**
   *    Get OKCoin Future Market Depth
   * @param {String} btc_usd    ltc_usd
   * @param {String} this_week   next_week   quarter
   * @param {Number} Number of orders, value: 5 - 200
   * @param {Number} value: 1 (merge depth)
   */

  function future_depth(symbol, contract_type, depth_size, merge, callback) {
    var path = config.version +  '/future_depth.do' + '?symbol=' + symbol + '&contract_type=' + contract_type;
      if (4 < depth_size && depth_size < 201)
      path+= '&size=' + depth_size;
      if (merge==1)
      path+= '&merge=' + merge;
    return publicMethod(path, callback);
  }

    /**
   *     Get Futures Trade History
   * @param {String} btc_usd    ltc_usd
   * @param {String} this_week   next_week   quarter
   */

  function future_trades(symbol, contract_type, callback) {
    var path = config.version +  '/future_trades.do' + '?symbol=' + symbol + '&contract_type=' + contract_type;
    return publicMethod(path, callback);
  }

    /**
   *      Get OKCoin Futures Index Price
   * @param {String} btc_usd    ltc_usd
   */
  
    function future_index(symbol, callback) {
    var path = config.version +  '/future_index.do' + '?symbol=' + symbol;
    return publicMethod(path, callback);
  }
  
    /**
   *      Get USD-CNY Exchange Rate
   */
  
    function exchange_rate(callback) {
    var path = config.version +  '/exchange_rate.do';
    return publicMethod(path, callback);
  }
  
  //TODO Get Estimated Delivery Price, Get Future Candlestick Data, Get Total Number Of Current Holding (cont)
  
  /**
  * Private methods supported
  * for Spot trading
  * For information on the parameters, check OKCoin website https://www.okcoin.com/about/rest_api.do
  */
  
    /**
   *      Get User Account Info
   */
  
  function userinfo(callback) {
    var path = config.version +  '/userinfo.do';
    var params = {};
    return privateMethod(path, params, callback);
  }

    /**
   *      Place Orders
   * @param {String} btc_usd    ltc_usd
   * @param {String} order type: limit order(buy/sell) market order(buy_market/sell_market)
   * @param {Number} order price. For limit orders, the price must be between 0~1,000,000. IMPORTANT: for market buy orders, the price is to total amount you want to buy, and it must be higher than the current price of 0.01 BTC (minimum buying unit) or 0.1 LTC.
   * @param {Number} order quantity. Must be higher than 0.01 for BTC, or 0.1 for LTC.
   */

    function trade(symbol, type, price, amount, callback) {
    var path = config.version +  '/trade.do';
    var params = {};
    if (amount) params.amount =  amount;
    if (price) params.price = price;
    params.symbol = symbol;
    params.type = type;
    return privateMethod(path, params, callback);
  }
  
    /**
   *      Get Order Info
   * @param {String} btc_usd    ltc_usd
   * @param {Number} if order_id is -1, then return all unfilled orders, otherwise return the order specified 
   */

  function order_info(symbol, order_id, callback) {
    var path = config.version +  '/order_info.do';
    var params = {};
    params.symbol =  symbol;
    params.order_id = order_id;
    return privateMethod(path, params, callback);
  }
  
  function cancel_order (symbol, order_id, callback) {
    var path = config.version +  '/cancel_order.do';
    var params = {};
    params.symbol =  symbol;
    params.order_id = order_id;
    return privateMethod(path, params, callback);
  }
  
  
  function withdraw(symbol, chargefee, trade_pwd, withdraw_address, withdraw_amount, callback) {
    var path = config.version +  '/withdraw.do';
    var params = {};
    params.chargefee = chargefee;
    params.symbol = symbol;
    params.trade_pwd = trade_pwd;
    params.withdraw_address = withdraw_address;
    params.withdraw_amount = withdraw_amount;
    return privateMethod(path, params, callback);
  }

  function account_records(symbol, type, current_page, page_length, callback) {
    var path = config.version +  '/account_records.do';
    var params = {};
    params.symbol = symbol;
    params.type = type;
    params.current_page = current_page;
    params.page_length = page_length;
    return privateMethod(path, params, callback);
  }
  
    /**
  * Private methods supported
  * for Futures trading
  * For information on the parameters, check OKCoin website https://www.okcoin.com/about/rest_api.do
  */
  
    /**
   *      Get OKCoin Future Account Info（Cross-Margin Mode）
   */
  
  function future_userinfo(callback) {
    var path = config.version +  '/future_userinfo.do';
    var params = {};
    return privateMethod(path, params, callback);
  }
  
    /**
   *       Get User Futures Positions （Cross-Margin Mode）
   * @param {String} btc_usd    ltc_usd
   * @param {String} this_week   next_week   quarter 
   */
  
  function future_position(symbol, contract_type, callback) {
    var path = config.version + '/future_position.do';
    var params = {};
    params.symbol = symbol;
    params.contract_type = contract_type;
    return privateMethod(path,params,callback)
  }
  
    /**
   *      Place Futures Orders
   * @param {String} btc_usd    ltc_usd
   * @param {String} this_week   next_week   quarter
   * @param {Number} order price
   * @param {Number} order quantity
   * @param {Number} 1: open long position    2: open short position    3:liquidate long position    4: liquidate short position
   * @param {Number} match best counter party price (BBO)? 0: No    1: Yes   If yes, the 'price' field is ignored
   * @param {Number} leverage rate value: 10 or 20 (10 by default)
   */
  
  function future_trade(symbol, contract_type, price, amount, type, match_price, lever_rate, callback) {
    var path = config.version +  '/future_trade.do';
    var params = {};
    params.amount =  amount;
    params.price = price;
    params.symbol = symbol;
    params.contract_type = contract_type;
    params.type = type;
    params.match_price = match_price;
    params.lever_rate = lever_rate;
    return privateMethod(path, params, callback);
  }
  
    /**
   *      Get OKCoin Futures Trade History (Not for Personal)
   * @param {String} btc_usd    ltc_usd
   * @param {String} contract delivery date, format :yyyy-MM-dd 
   * @param {Number} the start of transaction id 
   */
  
  function future_trades_history(symbol, date, since, callback) {
    var path = config.version + '/future_trades_history.do';
    var params = {};
    params.symbol = symbol;
    params.date = date;
    params.since = since;
    return privateMethod(path, params, callback);
  }
  
    /**
   *       Get User Future Order
   * @param {String} btc_usd    ltc_usd
   * @param {String} this_week   next_week   quarter 
   * @param {Number} query by order status 1: unfilled  2: filled
   * @param {Number} if order_id is -1, then return all unfilled orders, otherwise return the order specified
   * @param {Number} current page number
   * @param {Number} number of orders per page, maximum 50
   */
  
  function future_order_info(symbol, contract_type, status, order_id, current_page, page_length, callback) {
    var path = config.version +  '/future_order_info.do';
    var params = {};
    params.symbol =  config.symbol;
    params.contract_type = contract_type;
    params.status = status;
    params.order_id = order_id;
    params.current_page = current_page;
    params.page_length = page_length;
    return privateMethod(path, params, callback);
  }

    /**
   *       Cancel Future Order
   * @param {String} btc_usd    ltc_usd
   * @param {String} this_week   next_week   quarter 
   * @param {Number} order ID (multiple orders are separated by a comma ',', Max of 3 orders are allowed per request)
   */
  
  function future_cancel (symbol, contract_type, order_id, callback) {
    var path = config.version +  '/future_cancel.do';
    var params = {};
    params.symbol =  symbol;
    params.contract_type = contract_type;
    params.order_id = order_id;
    return privateMethod(path, params, callback);
  }


  /**
   * This method makes a public API request.
   * @param  {String}   path   The path to the API method 
   * @param  {Function} callback A callback function to be executed when the request is complete
   * @return {Object}            The request object
   */
  function publicMethod(path, callback) {
    var params = null;
    var url    = config.url + path;
    return okcoinRequest(url, 'GET', params, callback);
  }

  /**
   * This method makes a private API request.
   * @param  {String}   path   The path to the API method 
   * @param  {Object}   params   Arguments to pass to the api call
   * @param  {Function} callback A callback function to be executed when the request is complete
   * @return {Object}            The request object
   */
  function privateMethod(path, params, callback) {
    var url    = config.url + path;
    params.api_key = config.api_key;
    params.sign  = getMessageSignature(params);
    return okcoinRequest(url, 'POST', params, callback);
  }

  /**
   * This method returns a signature for a request as a md5-encoded uppercase string
   * @param  {Object}  params   The object to encode
   * @return {String}           The request signature
   */
  function getMessageSignature(params) {
    var sign = md5(stringifyToOKCoinFormat(params) + '&secret_key='+ config.secret).toUpperCase();
    return sign;
  }
  
  /**
   * This method returns the parameters as an alphabetically sorted string
   * @param  {Object}  params   The object to encode
   * @return {String}           The request signature
   */
  function stringifyToOKCoinFormat(obj) {
    var arr = [],
        i,
        formattedObject = '';

    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            arr.push(i);
        }
    }
    arr.sort();
    for (i = 0; i < arr.length; i++) {
        if (i != 0) {
        formattedObject += '&';
        }
        formattedObject += arr[i] + '=' + obj[arr[i]];
    }
    return formattedObject;
}

  /**
   * This method sends the actual HTTP request
   * @param  {String}   url      The URL to make the request
   * @param  {String}   requestType   POST or GET
   * @param  {Object}   params   POST body
   * @param  {Function} callback A callback function to call when the request is complete
   * @return {Object}            The request object
   */
  function okcoinRequest(url, requestType, params, callback) {

    var options = {
      url: url,
      method: requestType,
      form: params,
			timeout: config.timeoutMS,
      maxAttempts: 3,
      retryDelay: 1000,  // (default) wait for 5s before trying again
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
    };
    
    var req = request(options, function(error, response, body) {
      if(typeof callback === 'function') {
        var data;
        if(error) {
          callback.call(self, new Error('Error in server response: ' + JSON.stringify(error)), null);
          return;
        }
        try {
          data = JSON.parse(body);         
        }
        catch(e) {
          callback.call(self, new Error('Could not understand response from server: ' + body), null);
          return;
        }
        if(data.error_code) {         
          callback.call(self, error_code_meaning(data.error_code), null);
        }
        else {
          callback.call(self, null, data);
        }
      }
    });

    return req;
  }
  
  /**
   * This method return the OKCoin error information
   * @param  {Integer}  error_code   OKCoin error code
   * @return {String}                Error
   */
  function error_code_meaning(error_code) {
        var codes = {     10000 : 'Required parameter can not be null',
                          10001 : 'Requests are too frequent',
                          10002 : 'System Error',
                          10003 : 'Restricted list request, please try again later',
                          10004 : 'IP restriction',
                          10005 : 'Key does not exist',
                          10006 : 'User does not exist',
                          10007 : 'Signatures do not match',
                          10008 : 'Illegal parameter',
                          10009 : 'Order does not exist',
                          10010 : 'Insufficient balance',
                          10011 : 'Order is less than minimum trade amount',
                          10012 : 'Unsupported symbol (not btc_cny or ltc_cny)',
                          10013 : 'This interface only accepts https requests',
                          10014 : 'Order price must be between 0 and 1,000,000',
                          10015 : 'Order price differs from current market price too much',
                          10016 : 'Insufficient coins balance',
                          10017 : 'API authorization error',
                          10026 : 'Loan (including reserved loan) and margin cannot be withdrawn',
                          10027 : 'Cannot withdraw within 24 hrs of authentication information modification',
                          10028 : 'Withdrawal amount exceeds daily limit',
                          10029 : 'Account has unpaid loan, please cancel/pay off the loan before withdraw',
                          10031 : 'Deposits can only be withdrawn after 6 confirmations',
                          10032 : 'Please enabled phone/google authenticator',
                          10033 : 'Fee higher than maximum network transaction fee',
                          10034 : 'Fee lower than minimum network transaction fee',
                          10035 : 'Insufficient BTC/LTC',
                          10036 : 'Withdrawal amount too low',
                          10037 : 'Trade password not set',
                          10040 : 'Withdrawal cancellation fails',
                          10041 : 'Withdrawal address not approved',
                          10042 : 'Admin password error',
                          10100 : 'User account frozen',
                          10216 : 'Non-available API',
                            503 : 'Too many requests (Http)'};
        if (!codes[error_code]) {
            return 'OKCoin error code :' + error_code +' is not yet supported by the API';
            }
        return( codes[error_code] );
  }
  
  
  self.ticker = ticker;
  self.future_ticker = future_ticker;
  self.trades = trades;
  self.future_trades = future_trades;
  self.depth = depth;
  self.future_depth = future_depth;
  self.future_index = future_index;
  self.exchange_rate = exchange_rate;
  self.userinfo = userinfo;
  self.future_userinfo = future_userinfo;
  self.future_position = future_position;
  self.trade = trade;
  self.order_info = order_info;
  self.withdraw = withdraw;
  self.account_records = account_records;
}

module.exports = OKCoin;
