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
function update_info(market_cap, price, vol24h) {
  $('.cap').html(format_num(market_cap)); // $16.61M
  $('.price .value').html(format_num(price, 10)); // $0.016985
  $('.supply .value').html('1000M'); // 1000M
  $('.vol24h .value').html(format_num(vol24h)); // $5.30M
}
function update_progress_bar(market_cap) {
  market_cap = parseFloat(market_cap);
  if (isNaN(market_cap)) return;
  let html = '';
  let config = [
    [ 'Seed Round',        70_000 ],
    [ 'Series A',         200_000 ],
    [ 'Series B',       1_000_000 ],
    [ 'Series C',      20_000_000 ],
    [ 'Series D',      50_000_000 ],
    [ 'Series E',     200_000_000 ],
    [ 'Series F',   1_000_000_000 ],
  ];
  for (let i=0; i<config.length; i++) {
    let [title, limit] = config[i];
    if (market_cap < limit) {
      let cap_pct = Math.ceil((market_cap/limit)*100);
      let left_pct = 100 - cap_pct;
      html += `
      <div class="round">
        <div class='left'>
          <div class='round-name'>${title}</div>
          <div class='pct-text'>Progress ${cap_pct}%</div>
        </div>
        <div class='right'>
          <div class='max'>${format_num(limit, 0)}</div>
          <div class='msg'>${left_pct}% To Go</div>
        </div>
        <div class="clear-box"></div>
        <div class="progress-bar">
          <div class="fill-bar" style="width: ${cap_pct}%;"></div>
        </div>
      </div>
      `;
      break;
    }
    else { // reached
      html += `
      <div class="round">
        <div class='left'>
          <div class='round-name'>${title}</div>
          <div class='pct-text'>Progress 100%</div>
        </div>
        <div class='right'>
          <div class='max'>${format_num(limit, 0)}</div>
          <div class='msg'>Reach!</div>
        </div>
        <div class="clear-box"></div>
        <div class="progress-bar">
          <div class="fill-bar"></div>
        </div>
      </div>
      `;
    }
  }
  $('.rounds').html(html);
}
function update_screen(data) {
  let price = data.attributes.token_prices[TOKEN_ADR];
  let market_cap = data.attributes.market_cap_usd[TOKEN_ADR];
  let vol24h = data.attributes.h24_volume_usd[TOKEN_ADR];
  //
  update_info(market_cap, price, vol24h);
  update_progress_bar(market_cap);
}

let sample_data = null;
/*
sample_data = {
    "data": {
        "id": "9bd64245-0c17-4549-9fba-f8eb4fb0c3d0",
        "type": "simple_token_price",
        "attributes": {
            "token_prices": {
                "63n6uKwTKepUKM13eLqxNPic44pGn2JMLCwrAQbRpump": "0.0000421969609289013840108215781225158253457723159956151898914329756"
            },
            "market_cap_usd": {
                "63n6uKwTKepUKM13eLqxNPic44pGn2JMLCwrAQbRpump": "42196.3943304537"
            },
            "h24_volume_usd": {
                "63n6uKwTKepUKM13eLqxNPic44pGn2JMLCwrAQbRpump": "3533.1576631965"
            }
        }
    }
}
*/
if (sample_data !== null) {
  update_screen(sample_data.data);
}
else {
  $.getJSON(TOKEN_API, resp => {
    update_screen(resp.data);
  });
}
