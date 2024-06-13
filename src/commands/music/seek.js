import { ApplicationCommandOptionType } from "discord.js";
import { SuccessEmbed, ErrorEmbed } from "../../modules/Embeds.js";
import { Util } from "discord-player";

export const data = {
  name: "seek",
  description: "Pular para um tempo específico da música",
  options: [
    {
      name: "timestamp",
      description: "Quantidade de segundos para pular",
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 0,
    },
  ],
  category: "music",
  queueOnly: true,
  validateVC: true,
};

export async function execute(interaction, queue) {
  const timestamp = interaction.options.getNumber("timestamp", true) * 1000;

  if (!queue.currentTrack) {
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Nehuma música tocando.")],
    });
  }

  if (timestamp > queue.currentTrack.durationMS) {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        ErrorEmbed(
          `Por favor coloque um tempo válido entre 0 et ${queue.currentTrack.durationMS / 1000}.`
        ),
      ],
    });
  }

  await interaction.deferReply();

  await queue.node.seek(timestamp);

  return interaction.editReply({
    embeds: [SuccessEmbed(`Seeked to ${Util.formatDuration(timestamp)}.`)],
  });
}
