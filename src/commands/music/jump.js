import { ApplicationCommandOptionType } from "discord.js";
import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "jump",
  description: "Pula para uma música específica da fila sem remover as outras",
  options: [
    {
      name: "position",
      description: "Posição da música na fila.",
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 1,
    },
  ],
  category: "music",
  queueOnly: true,
  validateVC: true,
};
export function execute(interaction, queue) {
  if (queue.isEmpty())
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("A fila está vazia.")],
    });

  const position = interaction.options.getNumber("position", true);

  if (position > queue.size)
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Esta posição não é válida.")],
    });

  queue.node.jump(position - 1);

  return interaction.reply({
    embeds: [SuccessEmbed(`Pulou para a posição: ${position}`)],
  });
}
