/*

post = {

    id: "15913gfq",
    url: "nodes/9xaib1v/posts/process/15913gfq",

    title: "A title",
    description: "Yes, a description",

    blocks: [
        {
            type: "html",
            url: "nodes/9xaib1v/media/html/1591chpq",
            id: "1591cimg"
        },

        {
            type: "form",
            url: "data/entities/1591x70r",
            id: "1591x8p9"
        },

        {
            type: "html",
            url: "nodes/9xaib1v/media/html/15s1ibga",
            id: "15s1idb4"
        }
    ]
};

<phi-post-editor ng-model="post"></phi-post-editor>

*/

(function() {

    angular
        .module("phidias-angular")
        .directive("phiPostEditor", phiPostEditor);

    function phiPostEditor() {

        return {

            restrict: "E",

            scope: {
                post: "=ngModel"
            },

            controller:       phiPostEditorController,
            controllerAs:     "vm",
            bindToController: true,

            templateUrl: '/components/elements/phi-post/editor/phi-post-editor.html'
        };

    };


    phiPostEditorController.$inject = ["phiApi", "$scope"];
    function phiPostEditorController(phiApi, $scope) {

        var vm         = this;

        vm.addBlock    = addBlock;
        vm.attachBlock = attachBlock;
        vm.removeBlock = removeBlock;
        vm.reorder     = reorder;

        ///////////////////////

        $scope.$watch("vm.post", function(newValue) {
            
            if (!newValue) {
                return;
            }

            /* Testing */
            vm.insertable = [
                {
                    type: "html",
                    title: "texto HTML",
                    icon: "fa-font",

                    block: {
                        collectionUrl: '/media/html',
                        menu: [
                            {
                                state: "editor",
                                title: "editar",
                                icon: "fa-pencil"
                            },
                            {
                                state: "delete",
                                title: "eliminar",
                                icon: "fa-trash-o"
                            }
                        ]
                    }
                },

                {
                    type: "youtube",
                    title: "Youtube",
                    icon: "fa-youtube-play",

                    block: {
                        collectionUrl: vm.post.url + '/blocks',
                        menu: [
                            {
                                state: "editor",
                                title: "editar",
                                icon: "fa-pencil"
                            },
                            {
                                state: "delete",
                                title: "eliminar",
                                icon: "fa-trash-o"
                            }
                        ]
                    }
                },

                {
                    type: "files",
                    title: "Archivos",
                    icon: "fa-files-o",

                    block: {
                        collectionUrl: vm.post.url + '/resources/files',
                        menu: [
                            {
                                state: "editor",
                                title: "editar",
                                icon: "fa-pencil"
                            },
                            {
                                state: "delete",
                                title: "eliminar",
                                icon: "fa-trash-o"
                            }
                        ]
                    }
                },

                {
                    type: "form",
                    title: "Formulario",
                    icon: "fa-pencil-square-o",

                    block: {
                        collectionUrl: '/data/entities',
                        menu: [
                            {
                                state: "editor",
                                title: "editar",
                                icon: "fa-pencil"
                            },
                            {
                                state: "delete",
                                title: "eliminar",
                                icon: "fa-trash-o"
                            }
                        ]
                    }
                }
            ];
        });



        function addBlock(insertable) {

            if (!vm.post.blocks) {
                vm.post.blocks = [];
            }

            var newBlock   = insertable.block;
            newBlock.type  = insertable.type;
            newBlock.order = vm.post.blocks.length;

            vm.post.blocks.push(newBlock);

        };

        function attachBlock(block) {

            if (block.id) {

                phiApi.put( vm.post.url + "/blocks/" + block.id, block);

            } else {

                phiApi.post( vm.post.url + "/blocks", {

                    type:        block.type,
                    url:         block.url,
                    title:       block.title,
                    description: block.description,
                    order:       vm.post.blocks.length

                }).then( function(response) {
                    block.id = response.data.id;
                });

            }

        };

        function removeBlock(block) {

            if (block.id) {

                phiApi.remove(vm.post.url + "/blocks/" + block.id)
                    .then(function() {
                        vm.post.blocks.splice(vm.post.blocks.indexOf(block), 1);
                    });

            } else {
                vm.post.blocks.splice(vm.post.blocks.indexOf(block), 1);
            }

        };

        function reorder() {
            var blockIds = [];
            for (var cont = 0; cont < vm.post.blocks.length; cont++) {
                blockIds.push(vm.post.blocks[cont].id);
            }
            phiApi.put(vm.post.url+"/blocks/", blockIds);
        };

    };

})();