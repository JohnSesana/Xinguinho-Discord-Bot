import { BaseEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "now",
  description: "Mostra a música atual",
  category: "music",
  queueOnly: true,
};
export function execute(interaction, queue) {
  const track = queue.currentTrack;

  const embed = BaseEmbed()
    .setAuthor({ name: "Música atual 🎵" })
    .setTitle(track.title)
    .setURL(`${track.url}`)
    .setThumbnail(track.thumbnail)
    .setDescription(
      `Played by: ${track.requestedBy.toString()}\n\n${queue.node.createProgressBar()}`
    );

  return interaction.reply({ ephemeral: true, embeds: [embed] });
}
