import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "replay",
  description: "Replay de uma música desde o começo",
  category: "music",
  queueOnly: true,
  validateVC: true,
};

export function execute(interaction, queue) {
  if (!queue.currentTrack) {
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Nenhuma música tocando.")],
    });
  }

  queue.node.seek(0);

  return interaction.reply({
    embeds: [SuccessEmbed("Replay da música atual.")],
  });
}
