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
    get_blockheader_size(height) {
      return 43;
    }
};

var aeon_offset_1 = {
    height: 1000000,
    supply: "16230799273689217059",
    supply_proj: "16234708945129113452",
    accum_fee: "8090111859795393",
    bc_size: 2788344945,
};

var aeon_offset_2 = {
    height: 2000000,
    supply: "18718018.823913369984",
    supply_proj: "18718613.071987775199",
    accum_fee: "12047.645235642468",
    bc_size: 5263655129,
};
