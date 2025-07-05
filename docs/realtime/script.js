const TOKEN_ADR = "63n6uKwTKepUKM13eLqxNPic44pGn2JMLCwrAQbRpump";
const TOKEN_API = `https://api.geckoterminal.com/api/v2/simple/networks/solana/token_price/${TOKEN_ADR}?include_market_cap=true&mcap_fdv_fallback=true&include_24hr_vol=true%20Server%20response`;

function logic_num(num_str, digits) {
  let num = parseFloat(num_str);
  if (isNaN(num)) return num_str;
  let num_abs = Math.abs(num);
  if (num_abs >= 1_000_000)
    return (num / 1_000_000).toFixed(digits) + 'M';
  else if (num_abs >= 1_000)
    return (num / 1_000).toFixed(digits) + 'K';
  else
    return num.toFixed(digits).replace(/\.0+$/, '') // 123.00 -> 123
              .replace(/(\.\d*[1-9])0+$/, '$1');    // 12.300 -> 12.3
}
function format_num(num_str, digits=2) {
  return '$' + logic_num(num_str, digits);
}
function update_screen(data) {
  // update token info
  let price = data.attributes.token_prices[TOKEN_ADR];
  let market_cap = data.attributes.market_cap_usd[TOKEN_ADR];
  let vol24h = data.attributes.h24_volume_usd[TOKEN_ADR];
  $('.cap').html(format_num(market_cap)); // $16.61M
  $('.price .value').html(format_num(price, 10)); // $0.016985
  $('.supply .value').html('1000M'); // 1000M
  $('.vol24h .value').html(format_num(vol24h)); // $5.30M

  // TODO update progress bar
}

$.getJSON(TOKEN_API, resp => {
  update_screen(resp.data);
});

// dev only
//let sample_data = {
//    "data": {
//        "id": "9bd64245-0c17-4549-9fba-f8eb4fb0c3d0",
//        "type": "simple_token_price",
//        "attributes": {
//            "token_prices": {
//                "63n6uKwTKepUKM13eLqxNPic44pGn2JMLCwrAQbRpump": "0.0000421969609289013840108215781225158253457723159956151898914329756"
//            },
//            "market_cap_usd": {
//                "63n6uKwTKepUKM13eLqxNPic44pGn2JMLCwrAQbRpump": "42196.3943304537"
//            },
//            "h24_volume_usd": {
//                "63n6uKwTKepUKM13eLqxNPic44pGn2JMLCwrAQbRpump": "3533.1576631965"
//            }
//        }
//    }
//}
//update_screen(sample_data.data);
