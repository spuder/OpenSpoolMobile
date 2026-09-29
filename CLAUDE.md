# OpenSpoolMobile

React Native app that reads and writes OpenSpool NFC tags (JSON payload) for Bambu Lab printers.

## Filament types are case-sensitive

The `type` field written to a tag must exactly match a key in the OpenSpool firmware's
`filament_mappings` (https://github.com/spuder/OpenSpool/blob/main/firmware/bambu.h), e.g.
`"PLA"`, `"PA-CF"`, `"TPU for AMS"`. The firmware uses a case-sensitive exact lookup to
pick the Bambu `tray_info_idx`; anything else (e.g. `"pla"`) maps to an empty code.

- `types[].value` in `App.tsx` is what gets written — keep it identical to the firmware names.
- When adding a type, add it to both `types` and `filamentDefaults`, and confirm the
  firmware knows the name.
- Reading tags is case-insensitive, and `typeAliases` maps legacy values (e.g. `nylon` → `PA`).

## Default temperatures

`filamentDefaults` nozzle ranges come from Bambu Studio's `Generic *` filament profiles
(`nozzle_temperature_range_low/high` in
https://github.com/bambulab/BambuStudio/tree/master/resources/profiles/BBL/filament).
Every default must be a value in the `temperatures` dropdown list (5°C steps), or the
dropdown will render blank.
