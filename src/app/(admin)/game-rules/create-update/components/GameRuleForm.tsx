"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";
import {
  GameRuleFeeType,
  GameRulePayerType,
  useCreateGameRuleMutation,
  useGetGameRuleQuery,
  useUpdateGameRuleMutation,
} from "@/redux/features/gameRules/GameRuleApiSlice";

type FeeFormValue = {
  fee_type: GameRuleFeeType;
  amount: number;
  payer_type: GameRulePayerType;
};

type FormValues = {
  rule_name: string;
  round_qty_per_match: number;
  max_player: number;
  bet_amount: number;
  fees: [FeeFormValue, FeeFormValue, FeeFormValue];
};

const defaultFees: [FeeFormValue, FeeFormValue, FeeFormValue] = [
  { fee_type: "room", amount: 0, payer_type: "each_player" },
  { fee_type: "registration", amount: 0, payer_type: "winner" },
  { fee_type: "winning_commission", amount: 0, payer_type: "winner" },
];
const feeIndexes = [0, 1, 2] as const;

const feeLabels: Record<GameRuleFeeType, string> = {
  room: "Room Fee",
  registration: "Registration Fee",
  winning_commission: "Winning Commission",
};

export default function GameRuleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ruleId = searchParams.get("id");
  const ruleIdNum = ruleId ? Number(ruleId) : null;
  const [createGameRule, { isLoading }] = useCreateGameRuleMutation();
  const [updateGameRule, { isLoading: isUpdating }] = useUpdateGameRuleMutation();

  const { data: ruleData, isLoading: isRuleLoading } = useGetGameRuleQuery(
    { id: ruleIdNum ?? 0 },
    { skip: !ruleIdNum }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      rule_name: "",
      round_qty_per_match: undefined as unknown as number,
      max_player: undefined as unknown as number,
      bet_amount: undefined as unknown as number,
      fees: defaultFees,
    },
  });

  useEffect(() => {
    if (!ruleData?.data) return;

    const rule = ruleData.data;
    setValue("rule_name", rule.rule_name);
    setValue(
      "round_qty_per_match",
      ((rule as unknown as { round_qty_per_match?: number }).round_qty_per_match ??
        (rule as unknown as { match_qty_per_round?: number }).match_qty_per_round) as number
    );
    setValue("max_player", rule.max_player);
    setValue("bet_amount", rule.bet_amount);

    feeIndexes.forEach((index) => {
      const defaultFee = defaultFees[index];
      const fee =
        rule.fees?.find((item) => item.fee_type === defaultFee.fee_type) ?? defaultFee;
      setValue(`fees.${index}.fee_type`, defaultFee.fee_type);
      setValue(`fees.${index}.amount`, fee.amount);
      setValue(`fees.${index}.payer_type`, fee.payer_type);
    });
  }, [ruleData, setValue]);

  const onSubmit = async (values: FormValues) => {
    clearErrors();
    const payload = {
      rule_name: values.rule_name.trim(),
      round_qty_per_match: Number(values.round_qty_per_match),
      max_player: Number(values.max_player),
      bet_amount: Number(values.bet_amount),
      fees: values.fees.map((fee) => ({
        fee_type: fee.fee_type,
        amount: Number(fee.amount),
        payer_type: fee.payer_type,
      })),
    };

    try {
      if (ruleIdNum) {
        await updateGameRule({ id: ruleIdNum, ...payload }).unwrap();
        toast.success("Game rule updated");
      } else {
        await createGameRule(payload).unwrap();
        toast.success("Game rule created");
      }
      router.push("/game-rules");
    } catch (error: unknown) {
      const apiErrors =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { errors?: Record<string, string[] | string> } }).data?.errors
          : undefined;

      if (apiErrors && typeof apiErrors === "object") {
        for (const [key, value] of Object.entries(apiErrors)) {
          const message = Array.isArray(value) ? value[0] : value;
          if (!message) continue;

          setError(key as any, { type: "server", message: String(message) });
        }
      }

      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string; response?: { message?: string } } }).data
              ?.message ||
            (error as { data?: { message?: string; response?: { message?: string } } }).data
              ?.response?.message
          : "Failed to save rule";
      toast.error(message ?? "Failed to save rule");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {ruleIdNum ? "Update Mah Jong Rule" : "Create Mah Jong Rule"}
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Configure base rule values and fee collection for Mah Jong rooms.
      </p>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Rule Name</label>
            <Input placeholder="Rule Four" {...register("rule_name", { required: "Required" })} />
            {errors.rule_name && (
              <p className="mt-1 text-xs text-red-500">{errors.rule_name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Match Quantity Per Round
            </label>
            <Input
              type="number"
              placeholder="4"
              {...register("round_qty_per_match", {
                required: "Required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be >= 1" },
              })}
            />
            {errors.round_qty_per_match && (
              <p className="mt-1 text-xs text-red-500">{errors.round_qty_per_match.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Max Player</label>
            <Input
              type="number"
              placeholder="4"
              {...register("max_player", {
                required: "Required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be >= 1" },
              })}
            />
            {errors.max_player && (
              <p className="mt-1 text-xs text-red-500">{errors.max_player.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bet Amount</label>
            <Input
              type="number"
              placeholder="5000"
              {...register("bet_amount", {
                required: "Required",
                valueAsNumber: true,
                min: { value: 0, message: "Must be >= 0" },
              })}
            />
            {errors.bet_amount && (
              <p className="mt-1 text-xs text-red-500">{errors.bet_amount.message}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-white/[0.05]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Fees</h3>
          <div className="mt-4 space-y-4">
            {feeIndexes.map((index) => {
              const fee = defaultFees[index];
              return (
              <div
                key={fee.fee_type}
                className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 p-4 md:grid-cols-3 dark:border-white/[0.05]"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Fee Type</label>
                  <Input value={feeLabels[fee.fee_type]} disabled />
                  <input type="hidden" {...register(`fees.${index}.fee_type`)} />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Amount</label>
                  <Input
                    type="number"
                    placeholder="0"
                    {...register(`fees.${index}.amount`, {
                      required: "Required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Must be >= 0" },
                    })}
                  />
                  {errors.fees?.[index]?.amount && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fees[index]?.amount?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Payer Type
                  </label>
                  <select
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    {...register(`fees.${index}.payer_type`, { required: "Required" })}
                  >
                    <option value="each_player">Each Player</option>
                    <option value="winner">Winner</option>
                  </select>
                  {errors.fees?.[index]?.payer_type && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fees[index]?.payer_type?.message}
                    </p>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.push("/game-rules")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isUpdating || isRuleLoading}>
            {isLoading || isUpdating ? "Saving..." : isRuleLoading ? "Loading..." : "Save Rule"}
          </Button>
        </div>
      </form>
    </div>
  );
}
