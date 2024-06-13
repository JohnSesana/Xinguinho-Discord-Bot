import { ApplicationCommandOptionType } from "discord.js";
import {
  ErrorEmbed,
  SuccessEmbed,
  WarningEmbed,
} from "../../modules/Embeds.js";

export const data = {
  name: "move",
  description: "Move uma música da fila",
  options: [
    {
      name: "from",
      description: "Posição atual da música na fila.",
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 1,
    },
    {
      name: "to",
      description: "Nova posição da música na fila.",
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
  if (queue.size < 2) {
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Quantidade de músicas insuficientes na fila.")],
    });
  }

  const from = interaction.options.getNumber("from", true) - 1;
  const to = interaction.options.getNumber("to", true) - 1;

  if (from >= queue.size) {
    return interaction.reply({
      ephemeral: true,
      embeds: [WarningEmbed("A posição `from` não é válida.")],
    });
  }

  if (to >= queue.size) {
    return interaction.reply({
      ephemeral: true,
      embeds: [WarningEmbed("A posição `to` não é válida.")],
    });
  }

  if (from === to) {
    return interaction.reply({
      ephemeral: true,
      embeds: [WarningEmbed("A música já está nessa posição.")],
    });
  }

  queue.node.move(from, to);

  return interaction.reply({
    ephemeral: true,
    embeds: [
      SuccessEmbed(
        `Moveu \`${queue.tracks.at(from).title}\` para posição ${to + 1}.`
      ),
    ],
  });
}
