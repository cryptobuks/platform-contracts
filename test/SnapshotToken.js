import { expect } from "chai";
import EvmError from "./helpers/EVMThrow";
import { erc223TokenTests, deployTestErc223Callback } from "./helpers/tokenTestCases";
import { snapshotTokenTests } from "./helpers/snapshotTokenTestCases";
import { ZERO_ADDRESS } from "./helpers/constants";

const BigNumber = web3.BigNumber;
const TKN_DECIMALS = new BigNumber(10).toPower(18);

const TestSnapshotToken = artifacts.require("TestSnapshotToken");

contract("TestSnapshotToken", ([owner, owner2, broker, ...accounts]) => {
  let testSnapshotToken;

  beforeEach(async () => {
    testSnapshotToken = await TestSnapshotToken.new(ZERO_ADDRESS, 0);
  });

  describe("IERC223Token tests", () => {
    const initialBalanceTkn = TKN_DECIMALS.mul(91279837.398827).round();
    const getToken = () => testSnapshotToken;
    let erc223cb;
    const getTestErc223cb = () => erc223cb;

    beforeEach(async () => {
      erc223cb = await deployTestErc223Callback();
      await getToken().deposit(initialBalanceTkn, { from: owner });
      await getToken().enableTransfers(true);
    });

    erc223TokenTests(getToken, getTestErc223cb, owner, accounts[0], initialBalanceTkn);
  });

  describe("ITokenSnapshots tests", () => {
    const getToken = () => testSnapshotToken;

    const advanceSnapshotId = async snapshotable => {
      await snapshotable.createSnapshot();
      // uncomment below for daily boundary snapshot
      // await increaseTime(24 * 60 * 60);
      return snapshotable.currentSnapshotId.call();
    };

    const createClone = async (parentToken, parentSnapshotId) =>
      TestSnapshotToken.new(parentToken.address, parentSnapshotId);

    describe("MTokenController", async () => {
      let token;

      beforeEach(() => {
        token = getToken();
      });

      it("should transfer when transfer enabled", async () => {
        const supply = new web3.BigNumber(88172891);
        await token.deposit(supply, { from: owner });
        await token.enableTransfers(true);
        await token.transfer(owner2, 18281, { from: owner });
      });

      it("should reject transfer when transfer disabled", async () => {
        const supply = new web3.BigNumber(88172891);
        await token.deposit(supply, { from: owner });
        await token.enableTransfers(false);
        await expect(token.transfer(owner2, 18281, { from: owner })).to.be.rejectedWith(EvmError);
      });

      it("should ERC223 transfer when transfer enabled", async () => {
        const supply = new web3.BigNumber(88172891);
        await token.deposit(supply, { from: owner });
        await token.enableTransfers(true);
        await token.transfer["address,uint256,bytes"](owner2, 18281, "", {
          from: owner,
        });
      });

      it("should ERC223 reject transfer when transfer disabled", async () => {
        const supply = new web3.BigNumber(88172891);
        await token.deposit(supply, { from: owner });
        await token.enableTransfers(false);
        await expect(
          token.transfer["address,uint256,bytes"](owner2, 18281, "", {
            from: owner,
          }),
        ).to.be.rejectedWith(EvmError);
      });

      it("should approve when approve enabled", async () => {
        await token.enableApprovals(true);
        await token.approve(broker, 18281, { from: owner });
      });

      it("should reject approve when approve disabled", async () => {
        await token.enableApprovals(false);
        await expect(token.approve(broker, 18281, { from: owner })).to.be.rejectedWith(EvmError);
      });
    });

    it("should call currentSnapshotId without transaction", async () => {
      const token = getToken();
      const initialSnapshotId = await token.currentSnapshotId.call();
      await token.createSnapshot.call();
      const snapshotId = await token.currentSnapshotId.call();
      expect(snapshotId).to.be.bignumber.eq(initialSnapshotId);
    });

    snapshotTokenTests(getToken, createClone, advanceSnapshotId, owner, owner2, broker);
  });
});
