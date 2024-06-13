import { ApplicationCommandOptionType } from "discord.js";
import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "skipto",
  description: "Pule para uma música dada, removendo as outras músicas.",
  options: [
    {
      type: ApplicationCommandOptionType.Number,
      name: "position",
      description: "Posição da música para pular.",
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
    interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Esta posição não é válida.")],
    });

  queue.node.skipTo(position - 1);

  return interaction.reply({
    embeds: [SuccessEmbed(`Pulou para a posição ${position}.`)],
  });
}
