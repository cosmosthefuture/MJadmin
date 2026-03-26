"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { toast } from "sonner";
import {
  useCreateGameRuleMutation,
  useGetGameRuleQuery,
  useUpdateGameRuleMutation,
} from "@/redux/features/gameRules/GameRuleApiSlice";
import { useGetGamesQuery } from "@/redux/features/game/GameApiSlice";

type FormValues = {
  rule_name: string;
  max_bet_amount: number;
  min_bet_amount: number;
  time_per_round: number;
  game_id: number;
  user_limit: number;
};

export default function GameRuleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ruleId = searchParams.get("id");
  const ruleIdNum = ruleId ? Number(ruleId) : null;
  const [createGameRule, { isLoading }] = useCreateGameRuleMutation();
  const [updateGameRule, { isLoading: isUpdating }] = useUpdateGameRuleMutation();

  const { data: gamesData, isLoading: isGamesLoading } = useGetGamesQuery({
    page: 1,
    perPage: 100,
  });

  const { data: ruleData, isLoading: isRuleLoading } = useGetGameRuleQuery(
    { id: ruleIdNum ?? 0 },
    { skip: !ruleIdNum }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      rule_name: "",
      max_bet_amount: undefined as unknown as number,
      min_bet_amount: undefined as unknown as number,
      time_per_round: undefined as unknown as number,
      game_id: undefined as unknown as number,
      user_limit: undefined as unknown as number,
    },
  });

  useEffect(() => {
    if (gamesData?.data?.length && !getValues("game_id")) {
      setValue("game_id", gamesData.data[0].id);
    }
  }, [gamesData, getValues, setValue]);

  useEffect(() => {
    if (ruleData?.data) {
      const rule = ruleData.data;
      setValue("rule_name", rule.rule_name);
      setValue("max_bet_amount", rule.max_bet_amount);
      setValue("min_bet_amount", rule.min_bet_amount);
      setValue("time_per_round", rule.time_per_round);
      setValue("game_id", rule.game_id);
      setValue("user_limit", rule.user_limit);
    }
  }, [ruleData, setValue]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      rule_name: values.rule_name,
      max_bet_amount: Number(values.max_bet_amount),
      min_bet_amount: Number(values.min_bet_amount),
      time_per_round: Number(values.time_per_round),
      game_id: Number(values.game_id),
      user_limit: Number(values.user_limit),
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
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to save rule";
      toast.error(message ?? "Failed to save rule");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {ruleIdNum ? "Update Game Rule" : "Create Game Rule"}
      </h2>
      <p className="mt-1 text-sm text-gray-500">Define betting limits and timing for a game.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Rule Name</label>
            <Input placeholder="Rule name" {...register("rule_name", { required: "Required" })} />
            {errors.rule_name && (
              <p className="mt-1 text-xs text-red-500">{errors.rule_name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Game</label>
            <Select
              disabled={isGamesLoading || Boolean(ruleIdNum)}
              placeholder={isGamesLoading ? "Loading games..." : "Select game"}
              options={(gamesData?.data ?? []).map((game) => ({
                value: game.id.toString(),
                label: game.name,
              }))}
              {...register("game_id", { required: "Game is required", valueAsNumber: true })}
            />
            {errors.game_id && (
              <p className="mt-1 text-xs text-red-500">{errors.game_id.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Min Bet Amount</label>
            <Input
              type="number"
              placeholder="5000"
              {...register("min_bet_amount", {
                required: "Required",
                min: { value: 0, message: "Must be >= 0" },
              })}
            />
            {errors.min_bet_amount && (
              <p className="mt-1 text-xs text-red-500">{errors.min_bet_amount.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Max Bet Amount</label>
            <Input
              type="number"
              placeholder="30000"
              {...register("max_bet_amount", {
                required: "Required",
                min: { value: 0, message: "Must be >= 0" },
              })}
            />
            {errors.max_bet_amount && (
              <p className="mt-1 text-xs text-red-500">{errors.max_bet_amount.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Time per Round (seconds)
            </label>
            <Input
              type="number"
              placeholder="30"
              {...register("time_per_round", {
                required: "Required",
                min: { value: 1, message: "Must be >= 1" },
              })}
            />
            {errors.time_per_round && (
              <p className="mt-1 text-xs text-red-500">{errors.time_per_round.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">User Limit</label>
            <Input
              type="number"
              placeholder="5"
              {...register("user_limit", {
                required: "Required",
                min: { value: 1, message: "Must be >= 1" },
              })}
            />
            {errors.user_limit && (
              <p className="mt-1 text-xs text-red-500">{errors.user_limit.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.push("/game-rules")}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isUpdating || isGamesLoading || isRuleLoading}
          >
            {isLoading || isUpdating ? "Saving..." : isRuleLoading ? "Loading..." : "Save Rule"}
          </Button>
        </div>
      </form>
    </div>
  );
}
