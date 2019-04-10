function int_log2(x)
{
  var r = 0;
  while (true)
  {
    x >>= 1;
    if (x == 0)
      break;
    ++r;
  }
  return r;
}

var aeon_config = {
    MONEY_SUPPLY: "18446744073709551615",     // (uint64_t)(-1)
    EMISSION_SPEED_FACTOR_PER_MINUTE: 20,
    FINAL_SUBSIDY_PER_MINUTE: 300000000000,         // 3 * pow(10, 11)
    CRYPTONOTE_DISPLAY_DECIMAL_POINT: 12,
    DIFFICULTY_TARGET_V2: 240,
    DIFFICULTY_TARGET_V1: 60,
    get_difficulty_target: function(height) {
      return height < 592000 ? this.DIFFICULTY_TARGET_V1 : this.DIFFICULTY_TARGET_V2;
    },
    get_emission_speed_factor: function(target_minutes) {
      return this.EMISSION_SPEED_FACTOR_PER_MINUTE - int_log2(target_minutes);
    },
};
