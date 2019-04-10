var wownero_config = {
    MONEY_SUPPLY: "18446744073709551615",     // (uint64_t)(-1)
    EMISSION_SPEED_FACTOR_PER_MINUTE: 24,
    FINAL_SUBSIDY_PER_MINUTE: 0,
    CRYPTONOTE_DISPLAY_DECIMAL_POINT: 11,
    DIFFICULTY_TARGET_V2: 300,
    DIFFICULTY_TARGET_V1: 300,
    get_difficulty_target: function(height) {
      return this.DIFFICULTY_TARGET_V1;
    },
    get_emission_speed_factor: function(target_minutes) {
      return this.EMISSION_SPEED_FACTOR_PER_MINUTE - (target_minutes - 1);
    },
};
