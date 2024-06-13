import { ApplicationCommandOptionType } from "discord.js";
import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "remove",
  description: "Remove uma música da fila",
  options: [
    {
      name: "position",
      description: "Posição da música para remover",
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

  const position = interaction.options.getNumber("position", true) - 1;

  if (position >= queue.size)
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Esta posição não é valida.")],
    });

  const removed = queue.node.remove(position);

  return interaction.reply({
    embeds: [
      SuccessEmbed(`Removeu [${removed.title}](${removed.url}) da fila.`),
    ],
  });
}
