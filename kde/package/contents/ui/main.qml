import QtQuick
import org.kde.plasma.plasmoid
import org.kde.kirigami as Kirigami
import org.kde.plasma.plasma5support as P5Support

PlasmoidItem {
    id: root

    // bundled script, installed with the widget - no PATH guessing
    readonly property string runner: "bash " +
        Qt.resolvedUrl("../tools/plf-fix").toString().replace(/^file:\/\//, "")

    toolTipMainText: i18n("Persian Layout Fix")
    toolTipSubText: i18n("Select text in any app, then click (or use the shortcut)")

    P5Support.DataSource {
        id: exec
        engine: "executable"
        connectedSources: []
        onNewData: (source, data) => disconnectSource(source)   // one shot per click
    }

    function convertSelection() {
        exec.connectSource(root.runner)
    }

    compactRepresentation: Item {
        implicitWidth: Kirigami.Units.iconSizes.smallMedium
        implicitHeight: implicitWidth

        Kirigami.Icon {
            anchors.fill: parent
            source: "input-keyboard"
        }

        MouseArea {
            anchors.fill: parent
            onClicked: root.convertSelection()
        }
    }

    fullRepresentation: compactRepresentation
}
