var monero_config = {
    MONEY_SUPPLY: "18446744073709551615",     // (uint64_t)(-1)
    EMISSION_SPEED_FACTOR_PER_MINUTE: 20,
    FINAL_SUBSIDY_PER_MINUTE: 300000000000,         // 3 * pow(10, 11)
    CRYPTONOTE_DISPLAY_DECIMAL_POINT: 12,
    DIFFICULTY_TARGET_V2: 120,
    DIFFICULTY_TARGET_V1: 60,
    get_difficulty_target: function(height) {
      return height < 1009827 ? this.DIFFICULTY_TARGET_V1 : this.DIFFICULTY_TARGET_V2;
    },
    get_emission_speed_factor: function(target_minutes) {
      return this.EMISSION_SPEED_FACTOR_PER_MINUTE - (target_minutes - 1);
    },
    get_blockheader_size(height) {
      return 43;
    }
};

var monero_offset_1 = {
    height: 1000000,
    supply: "11319902360375037196",
    supply_proj: "11338799512357636715",
    accum_fee: "28065472452232840",
    bc_size: 2630363526,
};
