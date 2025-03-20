// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Singlefact} from "../src/Singlefact.sol";

contract SinglefactScript is Script {
    Singlefact public singlefact;

    function setUp() public {}


    function run() public {
        vm.startBroadcast();

        singlefact = new Singlefact();

        vm.stopBroadcast();
    }
}
