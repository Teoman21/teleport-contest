# Phase 1 inventory (generated from public sessions)

Every C function below consumes PRNG in at least one public session, so each must be ported exactly. Display-only code (no PRNG) is not listed here.

Total: 359 functions in 73 C files.

## makemon.c  (12 functions, 233702 calls)
- [ ] `rndmonst_adj` | 204394 calls | 44 sessions
- [ ] `mkclass_aligned` | 8609 calls | 13 sessions
- [ ] `m_initinv` | 7425 calls | 44 sessions
- [ ] `makemon` | 6075 calls | 44 sessions
- [ ] `newmonhp` | 3321 calls | 44 sessions
- [ ] `m_initweap` | 2346 calls | 28 sessions
- [ ] `makemon_rnd_goodpos` | 996 calls | 18 sessions
- [ ] `peace_minded` | 300 calls | 26 sessions
- [ ] `m_initthrow` | 98 calls | 18 sessions
- [ ] `set_mimic_sym` | 59 calls | 11 sessions
- [ ] `m_initgrp` | 47 calls | 15 sessions
- [ ] `grow_up` | 32 calls | 15 sessions

## mklev.c  (20 functions, 131517 calls)
- [ ] `mineralize` | 100206 calls | 44 sessions
- [ ] `fill_ordinary_room` | 8071 calls | 44 sessions
- [ ] `water_has_kelp` | 4994 calls | 9 sessions
- [ ] `maybe_sdoor` | 4902 calls | 9 sessions
- [ ] `finddpos` | 3954 calls | 44 sessions
- [ ] `dosdoor` | 3195 calls | 44 sessions
- [ ] `makecorridors` | 2148 calls | 44 sessions
- [ ] `makeniche` | 1040 calls | 44 sessions
- [ ] `mktrap` | 864 calls | 39 sessions
- [ ] `traptype_rnd` | 637 calls | 39 sessions
- [ ] `place_niche` | 306 calls | 44 sessions
- [ ] `makerooms` | 275 calls | 44 sessions
- [ ] `makelevel` | 265 calls | 44 sessions
- [ ] `mktrap_victim` | 250 calls | 27 sessions
- [ ] `generate_stairs_find_room` | 196 calls | 44 sessions
- [ ] `make_niches` | 108 calls | 44 sessions
- [ ] `mkfount` | 61 calls | 22 sessions
- [ ] `mkgrave` | 31 calls | 7 sessions
- [ ] `mkaltar` | 8 calls | 8 sessions
- [ ] `mk_knox_portal` | 6 calls | 6 sessions

## sp_lev.c  (21 functions, 97479 calls)
- [ ] `create_room` | 32170 calls | 44 sessions
- [ ] `get_location` | 26830 calls | 13 sessions
- [ ] `dig_corridor` | 23570 calls | 44 sessions
- [ ] `maze1xy` | 5900 calls | 1 sessions
- [ ] `lspo_replace_terrain` | 4597 calls | 8 sessions
- [ ] `check_room` | 1169 calls | 19 sessions
- [ ] `build_room` | 891 calls | 44 sessions
- [ ] `find_montype` | 713 calls | 12 sessions
- [ ] `lvlfill_swamp` | 380 calls | 1 sessions
- [ ] `lspo_map` | 368 calls | 12 sessions
- [ ] `fill_special_room` | 240 calls | 21 sessions
- [ ] `create_door` | 240 calls | 5 sessions
- [ ] `flip_level_rnd` | 128 calls | 11 sessions
- [ ] `fill_empty_maze` | 101 calls | 1 sessions
- [ ] `splev_initlev` | 71 calls | 13 sessions
- [ ] `rndtrap` | 55 calls | 1 sessions
- [ ] `lspo_gold` | 29 calls | 1 sessions
- [ ] `rnddoor` | 13 calls | 3 sessions
- [ ] `create_subroom` | 6 calls | 1 sessions
- [ ] `create_monster` | 5 calls | 1 sessions
- [ ] `random_wdir` | 3 calls | 2 sessions

## monmove.c  (9 functions, 69429 calls)
- [ ] `distfleeck` | 33817 calls | 42 sessions
- [ ] `m_move` | 28208 calls | 37 sessions
- [ ] `set_apparxy` | 6513 calls | 4 sessions
- [ ] `dochug` | 764 calls | 27 sessions
- [ ] `postmov` | 75 calls | 3 sessions
- [ ] `maybe_spin_web` | 44 calls | 5 sessions
- [ ] `watch_on_duty` | 6 calls | 1 sessions
- [ ] `disturb` | 1 calls | 1 sessions
- [ ] `mb_trapped` | 1 calls | 1 sessions

## mkobj.c  (10 functions, 42397 calls)
- [ ] `next_ident` | 12604 calls | 44 sessions
- [ ] `mksobj_init` | 9278 calls | 44 sessions
- [ ] `mkobj_erosions` | 6734 calls | 40 sessions
- [ ] `mkobj` | 4156 calls | 44 sessions
- [ ] `blessorcurse` | 4038 calls | 44 sessions
- [ ] `start_corpse_timeout` | 3706 calls | 34 sessions
- [ ] `mkbox_cnts` | 744 calls | 29 sessions
- [ ] `mkgold` | 500 calls | 43 sessions
- [ ] `mksobj` | 475 calls | 35 sessions
- [ ] `mk_tt_object` | 162 calls | 3 sessions

## mon.c  (13 functions, 26200 calls)
- [ ] `mcalcmove` | 25439 calls | 43 sessions
- [ ] `pickvampshape` | 193 calls | 6 sessions
- [ ] `mgender_from_permonst` | 136 calls | 6 sessions
- [ ] `decide_to_shapeshift` | 132 calls | 4 sessions
- [ ] `corpse_chance` | 109 calls | 22 sessions
- [ ] `xkilled` | 77 calls | 15 sessions
- [ ] `select_newcham_form` | 59 calls | 3 sessions
- [ ] `restrap` | 21 calls | 4 sessions
- [ ] `can_be_hatched` | 10 calls | 6 sessions
- [ ] `minliquid_core` | 10 calls | 1 sessions
- [ ] `pick_animal` | 7 calls | 2 sessions
- [ ] `movemon_singlemon` | 5 calls | 1 sessions
- [ ] `unstuck` | 2 calls | 1 sessions

## zap.c  (16 functions, 24071 calls)
- [ ] `obj_resists` | 23937 calls | 41 sessions
- [ ] `makewish` | 62 calls | 12 sessions
- [ ] `maybe_destroy_item` | 10 calls | 1 sessions
- [ ] `zap_hit` | 9 calls | 4 sessions
- [ ] `zhitm` | 8 calls | 2 sessions
- [ ] `destroy_items` | 7 calls | 5 sessions
- [ ] `zhitu` | 7 calls | 2 sessions
- [ ] `dobuzz` | 6 calls | 4 sessions
- [ ] `obj_shudders` | 5 calls | 1 sessions
- [ ] `zap_over_floor` | 5 calls | 1 sessions
- [ ] `resist` | 3 calls | 3 sessions
- [ ] `bounce_dir` | 3 calls | 1 sessions
- [ ] `dozap` | 3 calls | 2 sessions
- [ ] `zapyourself` | 2 calls | 2 sessions
- [ ] `weffects` | 2 calls | 1 sessions
- [ ] `do_osshock` | 2 calls | 1 sessions

## dogmove.c  (4 functions, 21155 calls)
- [ ] `dog_move` | 17643 calls | 39 sessions
- [ ] `dog_goal` | 2788 calls | 35 sessions
- [ ] `dog_invent` | 575 calls | 18 sessions
- [ ] `score_targ` | 149 calls | 18 sessions

## mkmap.c  (3 functions, 20601 calls)
- [ ] `init_fill` | 18868 calls | 5 sessions
- [ ] `litstate_rnd` | 1717 calls | 44 sessions
- [ ] `join_map` | 16 calls | 4 sessions

## rect.c  (1 functions, 17966 calls)
- [ ] `rnd_rect` | 17966 calls | 44 sessions

## allmain.c  (6 functions, 12743 calls)
- [ ] `moveloop_core` | 5414 calls | 43 sessions
- [ ] `maybe_generate_rnd_mon` | 5169 calls | 43 sessions
- [ ] `regen_hp` | 1125 calls | 18 sessions
- [ ] `u_calc_moveamt` | 916 calls | 10 sessions
- [ ] `moveloop_preamble` | 110 calls | 44 sessions
- [ ] `regen_pw` | 9 calls | 1 sessions

## mkroom.c  (10 functions, 12304 calls)
- [ ] `somey` | 3840 calls | 44 sessions
- [ ] `somex` | 3832 calls | 44 sessions
- [ ] `fill_zoo` | 2947 calls | 8 sessions
- [ ] `morguemon` | 1576 calls | 3 sessions
- [ ] `courtmon` | 48 calls | 1 sessions
- [ ] `squadmon` | 37 calls | 1 sessions
- [ ] `mkshop` | 16 calls | 9 sessions
- [ ] `pick_room` | 6 calls | 2 sessions
- [ ] `mk_zoo_thronemon` | 1 calls | 1 sessions
- [ ] `shrine_pos` | 1 calls | 1 sessions

## o_init.c  (3 functions, 10945 calls)
- [ ] `shuffle` | 10725 calls | 44 sessions
- [ ] `randomize_gem_colors` | 165 calls | 44 sessions
- [ ] `init_objects` | 55 calls | 44 sessions

## teleport.c  (5 functions, 9944 calls)
- [ ] `collect_coords` | 9909 calls | 43 sessions
- [ ] `safe_teleds` | 18 calls | 3 sessions
- [ ] `rloc` | 14 calls | 1 sessions
- [ ] `random_teleport_level` | 2 calls | 1 sessions
- [ ] `level_tele` | 1 calls | 1 sessions

## dungeon.c  (6 functions, 6186 calls)
- [ ] `place_level` | 2037 calls | 44 sessions
- [ ] `init_level` | 1480 calls | 31 sessions
- [ ] `induced_align` | 1429 calls | 15 sessions
- [ ] `init_dungeon_dungeons` | 580 calls | 44 sessions
- [ ] `parent_dlevel` | 385 calls | 44 sessions
- [ ] `init_castle_tune` | 275 calls | 44 sessions

## eat.c  (7 functions, 5448 calls)
- [ ] `gethungry` | 5358 calls | 43 sessions
- [ ] `eatcorpse` | 40 calls | 6 sessions
- [ ] `set_tin_variety` | 28 calls | 15 sessions
- [ ] `rottenfood` | 10 calls | 3 sessions
- [ ] `eye_of_newt_buzz` | 9 calls | 2 sessions
- [ ] `doeat` | 2 calls | 1 sessions
- [ ] `Hear_again` | 1 calls | 1 sessions

## sounds.c  (2 functions, 5135 calls)
- [ ] `dosounds` | 5134 calls | 38 sessions
- [ ] `yelp` | 1 calls | 1 sessions

## mkmaze.c  (11 functions, 4728 calls)
- [ ] `place_lregion` | 2000 calls | 15 sessions
- [ ] `walkfrom` | 1818 calls | 2 sessions
- [ ] `movebubbles` | 459 calls | 1 sessions
- [ ] `mv_bubble` | 198 calls | 1 sessions
- [ ] `mk_bubble` | 132 calls | 1 sessions
- [ ] `setup_waterlevel` | 68 calls | 1 sessions
- [ ] `makemaz` | 33 calls | 11 sessions
- [ ] `fumaroles` | 9 calls | 1 sessions
- [ ] `fixup_special` | 6 calls | 3 sessions
- [ ] `maze0xy` | 4 calls | 1 sessions
- [ ] `create_maze` | 1 calls | 1 sessions

## attrib.c  (7 functions, 3031 calls)
- [ ] `rnd_attr` | 1397 calls | 44 sessions
- [ ] `exercise` | 1122 calls | 37 sessions
- [ ] `vary_init_attr` | 347 calls | 44 sessions
- [ ] `newhp` | 152 calls | 9 sessions
- [ ] `exerchk` | 7 calls | 2 sessions
- [ ] `redist_attr` | 4 calls | 1 sessions
- [ ] `poisoned` | 2 calls | 1 sessions

## selvar.c  (3 functions, 1547 calls)
- [ ] `selection_filter_percent` | 1215 calls | 4 sessions
- [ ] `selection_do_randline` | 262 calls | 3 sessions
- [ ] `selection_rndcoord` | 70 calls | 10 sessions

## restore.c  (1 functions, 1238 calls)
- [ ] `getlev` | 1238 calls | 8 sessions

## uhitm.c  (14 functions, 1218 calls)
- [ ] `mhitm_knockback` | 688 calls | 20 sessions
- [ ] `hitum` | 171 calls | 16 sessions
- [ ] `passive` | 99 calls | 11 sessions
- [ ] `do_attack` | 70 calls | 18 sessions
- [ ] `known_hitum` | 49 calls | 9 sessions
- [ ] `mhitm_mgc_atk_negated` | 46 calls | 8 sessions
- [ ] `mhitm_ad_drst` | 30 calls | 3 sessions
- [ ] `hmon_hitmon_barehands` | 24 calls | 4 sessions
- [ ] `hmon_hitmon_stagger` | 19 calls | 4 sessions
- [ ] `mhitm_ad_elec` | 12 calls | 5 sessions
- [ ] `mhitm_ad_legs` | 4 calls | 1 sessions
- [ ] `mhitm_ad_ston` | 3 calls | 1 sessions
- [ ] `mhitm_ad_cold` | 2 calls | 1 sessions
- [ ] `hmon_hitmon_misc_obj` | 1 calls | 1 sessions

## shknam.c  (6 functions, 1035 calls)
- [ ] `mkshobj_at` | 478 calls | 11 sessions
- [ ] `get_shop_item` | 463 calls | 11 sessions
- [ ] `shkinit` | 46 calls | 11 sessions
- [ ] `stock_room` | 28 calls | 11 sessions
- [ ] `shkveg` | 19 calls | 1 sessions
- [ ] `nameshk` | 1 calls | 1 sessions

## u_init.c  (5 functions, 737 calls)
- [ ] `trquan` | 574 calls | 44 sessions
- [ ] `u_init_role` | 83 calls | 36 sessions
- [ ] `u_init_misc` | 55 calls | 44 sessions
- [ ] `ini_inv_adjust_obj` | 22 calls | 12 sessions
- [ ] `u_init_race` | 3 calls | 1 sessions

## mhitu.c  (5 functions, 703 calls)
- [ ] `mattacku` | 383 calls | 18 sessions
- [ ] `hitmu` | 275 calls | 15 sessions
- [ ] `gulpmu` | 26 calls | 1 sessions
- [ ] `passiveum` | 17 calls | 1 sessions
- [ ] `summonmu` | 2 calls | 1 sessions

## muse.c  (9 functions, 674 calls)
- [ ] `rnd_defensive_item` | 279 calls | 15 sessions
- [ ] `rnd_misc_item` | 260 calls | 11 sessions
- [ ] `rnd_offensive_item` | 116 calls | 8 sessions
- [ ] `mbhitm` | 6 calls | 1 sessions
- [ ] `find_misc` | 5 calls | 1 sessions
- [ ] `use_offensive` | 5 calls | 1 sessions
- [ ] `use_misc` | 1 calls | 1 sessions
- [ ] `precheck` | 1 calls | 1 sessions
- [ ] `use_defensive` | 1 calls | 1 sessions

## engrave.c  (4 functions, 656 calls)
- [ ] `wipeout_text` | 618 calls | 17 sessions
- [ ] `random_engraving` | 26 calls | 14 sessions
- [ ] `doengrave` | 8 calls | 1 sessions
- [ ] `wipe_engr_at` | 4 calls | 3 sessions

## trap.c  (19 functions, 563 calls)
- [ ] `hole_destination` | 239 calls | 14 sessions
- [ ] `mintrap` | 108 calls | 5 sessions
- [ ] `rnd_nextto_goodpos` | 72 calls | 3 sessions
- [ ] `find_random_launch_coord` | 40 calls | 9 sessions
- [ ] `choose_trapnote` | 34 calls | 15 sessions
- [ ] `burnarmor` | 29 calls | 2 sessions
- [ ] `trapeffect_magic_trap` | 10 calls | 4 sessions
- [ ] `trapeffect_bear_trap` | 9 calls | 2 sessions
- [ ] `trapeffect_dart_trap` | 5 calls | 4 sessions
- [ ] `trapeffect_slp_gas_trap` | 3 calls | 3 sessions
- [ ] `domagictrap` | 2 calls | 2 sessions
- [ ] `trapeffect_pit` | 2 calls | 2 sessions
- [ ] `trapeffect_landmine` | 2 calls | 1 sessions
- [ ] `thitm` | 2 calls | 2 sessions
- [ ] `trapeffect_fire_trap` | 2 calls | 1 sessions
- [ ] `lava_effects` | 1 calls | 1 sessions
- [ ] `trapeffect_rocktrap` | 1 calls | 1 sessions
- [ ] `trapeffect_rust_trap` | 1 calls | 1 sessions
- [ ] `erode_obj` | 1 calls | 1 sessions

## mthrowu.c  (10 functions, 437 calls)
- [ ] `m_lined_up` | 333 calls | 2 sessions
- [ ] `m_throw` | 36 calls | 6 sessions
- [ ] `linedup` | 21 calls | 5 sessions
- [ ] `thitu` | 14 calls | 7 sessions
- [ ] `u_catch_thrown_obj` | 10 calls | 5 sessions
- [ ] `monmulti` | 7 calls | 3 sessions
- [ ] `spitmm` | 6 calls | 1 sessions
- [ ] `breamm` | 4 calls | 1 sessions
- [ ] `thrwmu` | 3 calls | 1 sessions
- [ ] `ohitmon` | 3 calls | 2 sessions

## questpgr.c  (1 functions, 391 calls)
- [ ] `qt_montype` | 391 calls | 4 sessions

## dig.c  (2 functions, 303 calls)
- [ ] `mdig_tunnel` | 301 calls | 7 sessions
- [ ] `zap_dig` | 2 calls | 2 sessions

## priest.c  (4 functions, 299 calls)
- [ ] `pri_move` | 142 calls | 4 sessions
- [ ] `move_special` | 122 calls | 5 sessions
- [ ] `priestini` | 30 calls | 5 sessions
- [ ] `intemple` | 5 calls | 1 sessions

## do_name.c  (3 functions, 259 calls)
- [ ] `rndghostname` | 255 calls | 4 sessions
- [ ] `noveltitle` | 3 calls | 3 sessions
- [ ] `roguename` | 1 calls | 1 sessions

## mondata.c  (1 functions, 246 calls)
- [ ] `resist_conflict` | 246 calls | 1 sessions

## bones.c  (3 functions, 242 calls)
- [ ] `getbones` | 179 calls | 42 sessions
- [ ] `drop_upon_death` | 54 calls | 2 sessions
- [ ] `can_make_bones` | 9 calls | 4 sessions

## mhitm.c  (3 functions, 235 calls)
- [ ] `mattackm` | 109 calls | 17 sessions
- [ ] `passivemm` | 78 calls | 17 sessions
- [ ] `mdamagem` | 48 calls | 16 sessions

## timeout.c  (3 functions, 233 calls)
- [ ] `attach_egg_hatch_timeout` | 155 calls | 6 sessions
- [ ] `nh_timeout` | 45 calls | 1 sessions
- [ ] `slip_or_trip` | 33 calls | 1 sessions

## objnam.c  (3 functions, 222 calls)
- [ ] `rnd_class` | 160 calls | 13 sessions
- [ ] `rnd_otyp_by_namedesc` | 58 calls | 12 sessions
- [ ] `readobjnam` | 4 calls | 4 sessions

## extralev.c  (6 functions, 208 calls)
- [ ] `corr` | 105 calls | 1 sessions
- [ ] `makeroguerooms` | 50 calls | 1 sessions
- [ ] `miniwalk` | 18 calls | 1 sessions
- [ ] `makerogueghost` | 14 calls | 1 sessions
- [ ] `roguecorr` | 13 calls | 1 sessions
- [ ] `roguejoin` | 8 calls | 1 sessions

## topten.c  (2 functions, 171 calls)
- [ ] `get_rnd_toptenentry` | 165 calls | 4 sessions
- [ ] `tt_doppel` | 6 calls | 3 sessions

## exper.c  (2 functions, 163 calls)
- [ ] `newpw` | 162 calls | 26 sessions
- [ ] `rndexp` | 1 calls | 1 sessions

## fountain.c  (7 functions, 127 calls)
- [ ] `gush` | 75 calls | 2 sessions
- [ ] `dryup` | 19 calls | 7 sessions
- [ ] `drinkfountain` | 13 calls | 6 sessions
- [ ] `dipfountain` | 13 calls | 2 sessions
- [ ] `drinksink` | 5 calls | 1 sessions
- [ ] `dowaterdemon` | 1 calls | 1 sessions
- [ ] `dowatersnakes` | 1 calls | 1 sessions

## lock.c  (4 functions, 121 calls)
- [ ] `doopen_indir` | 94 calls | 15 sessions
- [ ] `forcelock` | 20 calls | 2 sessions
- [ ] `picklock` | 4 calls | 1 sessions
- [ ] `breakchestlock` | 3 calls | 1 sessions

## weapon.c  (1 functions, 119 calls)
- [ ] `dmgval` | 119 calls | 16 sessions

## pray.c  (5 functions, 87 calls)
- [ ] `angrygods` | 32 calls | 5 sessions
- [ ] `prayer_done` | 26 calls | 5 sessions
- [ ] `pleased` | 25 calls | 2 sessions
- [ ] `godvoice` | 3 calls | 3 sessions
- [ ] `fix_worst_trouble` | 1 calls | 1 sessions

## dog.c  (3 functions, 69 calls)
- [ ] `mon_arrive` | 42 calls | 17 sessions
- [ ] `pet_type` | 26 calls | 22 sessions
- [ ] `abuse_dog` | 1 calls | 1 sessions

## detect.c  (1 functions, 61 calls)
- [ ] `dosearch0` | 61 calls | 4 sessions

## dokick.c  (4 functions, 57 calls)
- [ ] `kick_door` | 48 calls | 6 sessions
- [ ] `kick_ouch` | 7 calls | 2 sessions
- [ ] `kick_monster` | 1 calls | 1 sessions
- [ ] `kickdmg` | 1 calls | 1 sessions

## role.c  (6 functions, 42 calls)
- [ ] `role_init` | 15 calls | 12 sessions
- [ ] `pick_align` | 8 calls | 6 sessions
- [ ] `randrole` | 6 calls | 4 sessions
- [ ] `pick_gend` | 5 calls | 5 sessions
- [ ] `pick_role` | 4 calls | 4 sessions
- [ ] `pick_race` | 4 calls | 4 sessions

## region.c  (1 functions, 41 calls)
- [ ] `create_gas_cloud` | 41 calls | 5 sessions

## hack.c  (3 functions, 36 calls)
- [ ] `u_maybe_impaired` | 21 calls | 2 sessions
- [ ] `maybe_smudge_engr` | 14 calls | 3 sessions
- [ ] `trapmove` | 1 calls | 1 sessions

## mcastu.c  (2 functions, 33 calls)
- [ ] `choose_monster_spell` | 27 calls | 3 sessions
- [ ] `castmu` | 6 calls | 2 sessions

## rumors.c  (1 functions, 29 calls)
- [ ] `getrumor` | 29 calls | 11 sessions

## wizard.c  (3 functions, 22 calls)
- [ ] `pick_nasty` | 9 calls | 2 sessions
- [ ] `nasty` | 9 calls | 1 sessions
- [ ] `tactics` | 4 calls | 1 sessions

## spell.c  (3 functions, 17 calls)
- [ ] `spelleffects_check` | 12 calls | 2 sessions
- [ ] `study_book` | 4 calls | 2 sessions
- [ ] `cursed_book` | 1 calls | 1 sessions

## polyself.c  (3 functions, 16 calls)
- [ ] `polymon` | 8 calls | 2 sessions
- [ ] `newman` | 5 calls | 1 sessions
- [ ] `polyself` | 3 calls | 1 sessions

## do.c  (3 functions, 14 calls)
- [ ] `goto_level` | 9 calls | 3 sessions
- [ ] `u_collide_m` | 4 calls | 4 sessions
- [ ] `familiar_level_msg` | 1 calls | 1 sessions

## dothrow.c  (4 functions, 13 calls)
- [ ] `should_mulch_missile` | 7 calls | 2 sessions
- [ ] `thitmonst` | 3 calls | 2 sessions
- [ ] `throw_obj` | 2 calls | 2 sessions
- [ ] `tmiss` | 1 calls | 1 sessions

## steed.c  (2 functions, 13 calls)
- [ ] `mount_steed` | 7 calls | 2 sessions
- [ ] `landing_spot` | 6 calls | 2 sessions

## were.c  (1 functions, 13 calls)
- [ ] `were_change` | 13 calls | 4 sessions

## potion.c  (8 functions, 9 calls)
- [ ] `peffect_confusion` | 2 calls | 2 sessions
- [ ] `peffect_paralysis` | 1 calls | 1 sessions
- [ ] `peffect_booze` | 1 calls | 1 sessions
- [ ] `peffect_healing` | 1 calls | 1 sessions
- [ ] `bottlename` | 1 calls | 1 sessions
- [ ] `potionhit` | 1 calls | 1 sessions
- [ ] `potionbreathe` | 1 calls | 1 sessions
- [ ] `peffect_extra_healing` | 1 calls | 1 sessions

## read.c  (2 functions, 9 calls)
- [ ] `assign_candy_wrapper` | 6 calls | 5 sessions
- [ ] `seffect_identify` | 3 calls | 2 sessions

## artifact.c  (3 functions, 9 calls)
- [ ] `spec_abon` | 5 calls | 1 sessions
- [ ] `mk_artifact` | 2 calls | 2 sessions
- [ ] `touch_artifact` | 2 calls | 1 sessions

## music.c  (2 functions, 8 calls)
- [ ] `improvised_notes` | 6 calls | 1 sessions
- [ ] `do_improvisation` | 2 calls | 1 sessions

## ball.c  (1 functions, 8 calls)
- [ ] `drag_down` | 8 calls | 1 sessions

## cmd.c  (1 functions, 6 calls)
- [ ] `confdir` | 6 calls | 1 sessions

## do_wear.c  (3 functions, 5 calls)
- [ ] `destroy_arm` | 3 calls | 1 sessions
- [ ] `Amulet_on` | 1 calls | 1 sessions
- [ ] `Boots_on` | 1 calls | 1 sessions

## vault.c  (1 functions, 4 calls)
- [ ] `gd_move` | 4 calls | 1 sessions

## apply.c  (2 functions, 4 calls)
- [ ] `jump` | 3 calls | 1 sessions
- [ ] `use_cream_pie` | 1 calls | 1 sessions

## wield.c  (1 functions, 3 calls)
- [ ] `dotwoweapon` | 3 calls | 2 sessions

## steal.c  (1 functions, 2 calls)
- [ ] `steal` | 2 calls | 2 sessions

## shk.c  (1 functions, 1 calls)
- [ ] `append_honorific` | 1 calls | 1 sessions

## explode.c  (1 functions, 1 calls)
- [ ] `mon_explodes` | 1 calls | 1 sessions

## Keys used in public sessions
` `×1515, `h`×1066, `l`×870, `s`×711, `y`×475, `j`×442, `k`×433, `^J`×425, `n`×402, `e`×330, `b`×302, `i`×276, `u`×243, `a`×232, `o`×211, `.`×209, `^[`×205, `#`×189, `r`×182, `d`×143, `^V`×142, `t`×133, `?`×113, `w`×112, `p`×109, `c`×107, `m`×98, `H`×94, `f`×91, `F`×87, `L`×84, `^M`×83, `>`×81, `g`×78, `z`×75, `:`×62, `,`×53, `^W`×53, `q`×47, `+`×46, `v`×39, `K`×39, `\`×37, `J`×34, `^X`×34, `^D`×32, `0`×32, `2`×30, `_`×29, `5`×23, `9`×22, `3`×22, `1`×22, `B`×21, `Y`×20, `/`×20, `N`×19, `T`×18, `W`×15, `P`×15, `^T`×15, `U`×14, `4`×14, `Z`×13, `<`×11, `$`×11, `x`×10, `@`×9, `E`×9, `"`×9, `D`×8, `DEL`×8, `;`×8, `S`×8, `O`×6, `A`×6, `G`×6, `=`×5, `*`×4, `-`×4, `^F`×4, `[`×3, `!`×3, `M`×3, `7`×3, `8`×3, `^G`×3, `^L`×2, `)`×2, `C`×2, `~`×1, `R`×1, `^O`×1, `^H`×1, `'`×1, `Q`×1, `I`×1, `6`×1, `(`×1, `{`×1, `^R`×1

## Extended commands typed (including tab-completion prefixes)
`#wizwish`×14, `#chat`×12, `#wizmap`×12, `#l`×11, `#d`×11, `#ride`×10, `#pray`×9, `#levelchange`×8, `#wizintrinsic`×7, `#f`×5, `#overview`×5, `#twoweapon`×5, `#monster`×5, `#jump`×5, `#name`×4, `#conduct`×3, `#quit`×3, `#sit`×3, `#dip`×3, `#enhance`×3, `#polyself`×3, `#loot`×3, `#force`×3, `#wizgenesis`×3, `#vanquished`×2, `#offer`×2, `#annotate`×2, `#version`×2, `#adjust`×2, `#wipe`×2, `#invoke`×2, `#untrap`×2, `#turn`×2, `#wizwhere`×2, `#q`×1, `#ll`×1, `#hat`×1, `#c`×1, `#cha`×1, `#chronicle`×1, `#genocided`×1, `#terrain`×1, `#rub`×1, `#tip`×1, `#herecmdmenu`×1, `#goto`×1, `#wish`×1, `#wizidentify`×1, `#wi`×1

## Sessions by screen points
- 1953 `seed0030-ten-diverse-deaths`
- 1814 `seed4500-knight-coverage`
- 833 `seed0360-wizard-world-tour`
- 714 `seed0014-dequa-fountain-explore`
- 595 `seed0002-healer-reflection-drummer`
- 532 `seed0399-wizard-hallu-actions`
- 410 `seed5002-wizard-coverage-pair`
- 409 `seed0004-feeding-pony`
- 366 `seed0361-archeologist-tour`
- 324 `seed0367-priest-quest-tour`
- 308 `seed0012-monk-vault-escort`
- 303 `seed0108-wizard-extcmd-wishlist`
- 302 `seed0007-rogue-snake-swamp`
- 267 `seed0106-priest-extcmd-sweep`
- 249 `seed5006-tourist-stress-disaster`
- 230 `seed2200-wizard-quaff-zap-read`
- 219 `seed0383-wizard-hallucinate`
- 127 `seed0116-wizard-wear-shop`
- 124 `seed0373-barbarian-quest-tour`
- 123 `seed0006-wizard-water-demon`
- 99 `seed0013-friday13-save-then-fullmoon-restore`
- 98 `seed0107-samurai-twoweapon-enhance`
- 87 `seed0398-wizard-wandpoly-pile`
- 84 `seed0900-tourist-explore-actions`
- 73 `seed0009-swimmer-mforce`
- 67 `seed0017-samurai-altar-pray`
- 60 `seed0103-knight-ride-pony`
- 59 `seed0013-rogue-friday13-combat`
- 51 `seed1150-caveman-explore-move`
- 51 `seed0700-samurai-explore-descend`
- 44 `seed0015-valk-level2-pit-dog-wait`
- 43 `seed0104-knight-ride-combat`
- 41 `seed0060-orc-rogue-kick-search`
- 40 `seed1500-rogue-explore-move`
- 40 `seed0200-monk-north-search`
- 38 `seed2600-wizard-custom-binds`
- 36 `seed0016-healer-newmoon-eat-zap`
- 33 `seed0077-rogue-chargen`
- 30 `seed0105-valk-chat-lamp-ration`
- 28 `seed0501-priest-cast-read-turn`
- 27 `seed0101-ranger-quiver-throw-travel-engrave`
- 26 `seed1800-tourist-eat-throw`
- 25 `seed0102-ranger-name-cancel`
- 23 `seed8000-tourist-starter`
