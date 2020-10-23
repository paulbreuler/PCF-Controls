

# This script will rename solution files and modify there contents to save time when building releases using the variables below.
# v1.0 beta - works but needs to be cleaned up. 

# $projectName = "Duration Picker"
$directoyPath = "solutions";
$publisherName = "paulbreuler";
$publisherPrefix = "pbr";
$solutionName = "DurationPickerCustomControl";
$solutionXmlPath = ".\src\Other\Solution.xml";
$projFile = ".\$($solutionName).cdsproj";

function Get-XmlNode([ xml ]$XmlDocument, [string]$NodePath, [string]$NamespaceURI = "", [string]$NodeSeparatorCharacter = '.') {
    # If a Namespace URI was not given, use the Xml document's default namespace.
    if ([string]::IsNullOrEmpty($NamespaceURI)) { $NamespaceURI = $XmlDocument.DocumentElement.NamespaceURI }

    # In order for SelectSingleNode() to actually work, we need to use the fully qualified node path along with an Xml Namespace Manager, so set them up.
    $xmlNsManager = New-Object System.Xml.XmlNamespaceManager($XmlDocument.NameTable)
    $xmlNsManager.AddNamespace("ns", $NamespaceURI)
    $fullyQualifiedNodePath = "/ns:$($NodePath.Replace($($NodeSeparatorCharacter), '/ns:'))"

    # Try and get the node, then return it. Returns $null if the node was not found.
    $node = $XmlDocument.SelectSingleNode($fullyQualifiedNodePath, $xmlNsManager)
    return $node
}


# Move up to project root
# Providing a name you can use the following to set the path.
# git rev-parse --show-toplevel | Set-Location
# Set-Location $projectName 

# Assuming scripts are stored in a folder under the project 
$path = Split-Path $MyInvocation.MyCommand.Path -Parent
Set-Location ($path -replace "\\[^\\]*(?:\\)?$")


if (!(Test-Path -path $directoyPath)) {  
    New-Item -ItemType directory -Path $directoyPath
    Write-Host "$($directoyPath) folder path has been created successfully."
               
}
else {
    Write-Host "$directoyPath already exists. Skipping...";
}

Set-Location solutions

if (!(Test-Path -Path "$($solutionName).cdsproj")) {
    pac solution init --publisher-name $publisherName --publisher-prefix $publisherPrefix
    Rename-Item -Path .\solutions.cdsproj -NewName "$($solutionName).cdsproj"
    Write-Host "CDS Project file renamed to $($solutionName).cdsproj"
}
else {
    Write-Host "$($solutionName).cdsproj already exists. Skipping..."
}


if (Test-Path -Path $solutionXmlPath) {
    [xml]$solutionXml = Get-Content $solutionXmlPath
    $solutionXml.ImportExportXml.SolutionManifest.UniqueName = $solutionName
    $solutionXml.ImportExportXml.SolutionManifest.LocalizedNames.LocalizedName.description = $solutionName
    $solutionXml.Save(("$(Get-Location)$($solutionXmlPath)" -replace '\.\\', '\'))

    Write-Host "Updated solution name and prefix"
}
else {
    Write-Host "$($solutionXmlPath) not found..."
}

# Add PropetyGroup to specify SolutionPackageType as Managed. Default build is unmanaged 

if (Test-Path -Path $projFile) {
    [xml]$manifestXml = Get-Content $projFile
    $node = Get-XmlNode -XmlDocument $manifestXml -NodePath Project.PropertyGroup.SolutionPackageType
    if ($null -ne $node) { 
        Write-Host "SolutionPackageType node already exists. Skipping..."
    }
    else {
        $xdns = $manifestXml.DocumentElement.NamespaceURI
        $elem = $manifestXml.CreateElement("PropertyGroup", $xdns)
        $elem2 = $manifestXml.CreateElement("SolutionPackageType", $xdns)
        $elem2.InnerText = "Managed" 
        $elem.AppendChild($elem2)
        $manifestXml.Project.AppendChild($elem)
        $manifestXml.Save(("$(Get-Location)$($projFile)" -replace '\.\\', '\'))
        Write-Host "Added SolutionPackageType node to $manifestXml"
    }

}
else {
    Write-Error "$projFile not found"
}


